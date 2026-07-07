import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../features/dashboard/dashboardApi';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, Users, ShoppingCart, Banknote, AlertTriangle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const isEmployee = user?.role === 'employee';

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    enabled: !isEmployee,
  });

  if (isEmployee) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-2xl font-semibold mb-2">Welcome to SkyMart ERP, {user?.name}!</h3>
            <p className="text-gray-600">You are logged in as an Employee. Use the sidebar to navigate to your accessible modules.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-100 h-32 border-none" />
          ))}
        </div>
        <Card className="animate-pulse bg-gray-100 h-96 border-none" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <p className="text-gray-600">Failed to load dashboard data.</p>
        <p className="text-sm text-red-500">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.data;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSales || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          {!stats?.lowStockProducts?.length ? (
            <p className="text-sm text-gray-500 py-4">No low stock products found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.lowStockProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive" className="bg-red-500 text-white hover:bg-red-600">
                        {product.stockQuantity} left
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
