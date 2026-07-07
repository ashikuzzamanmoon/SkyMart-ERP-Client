import { useQuery } from '@tanstack/react-query';
import { getSales } from '../features/sale/saleApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/ui/pagination';

const Sales = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sales', page],
    queryFn: () => getSales({ page, limit }),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        </div>
        <Card className="animate-pulse bg-gray-100 h-96 border-none" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600">Failed to load sales data.</p>
        <p className="text-sm text-red-500">{(error as any)?.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const sales = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, totalPages: 1 };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <Link to="/sales/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Sale
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          {!sales.length ? (
            <div className="text-center py-8 text-gray-500">
              No sales records found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead className="text-right">Grand Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale: any) => (
                      <TableRow key={sale._id}>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {sale.customer?.name || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          {sale.items?.length || 0} items
                        </TableCell>
                        <TableCell>
                          {sale.createdBy?.name || 'System'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-blue-600">
                          ৳{sale.grandTotal?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {meta.totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {[...Array(meta.totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(i + 1)}
                            isActive={page === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                          className={page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
