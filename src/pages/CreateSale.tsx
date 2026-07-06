import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getCustomers } from '../features/customer/customerApi';
import { getProducts } from '../features/product/productApi';
import { createSale } from '../features/sale/saleApi';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Combobox } from '../components/ui/combobox';
import { Input } from '../components/ui/input';
import { Trash2, Plus, ArrowLeft, Save } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

interface LineItem {
  id: string;
  productId: string;
  quantity: number;
}

const CreateSale = () => {
  const navigate = useNavigate();

  // Queries
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: () => getCustomers({ limit: 1000 }), // Fetching all for the dropdown
  });

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => getProducts({ limit: 1000 }), // Fetching all for the dropdown
  });

  // State
  const [customer, setCustomer] = useState<string>('');
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), productId: '', quantity: 1 },
  ]);

  // Derived Options
  const customerOptions = useMemo(() => {
    return (customersData?.data || []).map((c: any) => ({
      value: c._id,
      label: `${c.name} - ${c.phone}`,
    }));
  }, [customersData]);

  const productOptions = useMemo(() => {
    return (productsData?.data || []).map((p: any) => ({
      value: p._id,
      label: `${p.name} (SKU: ${p.sku}) - ৳${p.sellingPrice} - Stock: ${p.stockQuantity}`,
      disabled: p.stockQuantity === 0,
      product: p, // keep a reference to full product
    }));
  }, [productsData]);

  const getProductDetails = (id: string) => {
    return productOptions.find((p) => p.value === id)?.product;
  };

  // Calculations
  const { subtotals, grandTotal } = useMemo(() => {
    const subs: Record<string, number> = {};
    let total = 0;

    items.forEach((item) => {
      if (item.productId) {
        const prod = getProductDetails(item.productId);
        if (prod) {
          const sub = prod.sellingPrice * item.quantity;
          subs[item.id] = sub;
          total += sub;
        }
      }
    });

    return { subtotals: subs, grandTotal: total };
  }, [items, productOptions]);

  // Handlers
  const handleAddLine = () => {
    setItems([...items, { id: crypto.randomUUID(), productId: '', quantity: 1 }]);
  };

  const handleRemoveLine = (id: string) => {
    if (items.length === 1) {
      toast.error('Sale must contain at least one item.');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const handleProductChange = (index: number, productId: string) => {
    // Check for duplicates
    if (items.some((item, i) => i !== index && item.productId === productId)) {
      toast.error('This product is already added to the sale. Update the quantity instead.');
      return;
    }

    const newItems = [...items];
    newItems[index].productId = productId;
    
    // Ensure quantity doesn't exceed stock if it was previously set high
    const prod = getProductDetails(productId);
    if (prod && newItems[index].quantity > prod.stockQuantity) {
      newItems[index].quantity = prod.stockQuantity;
    }

    setItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (isNaN(quantity) || quantity < 1) return;

    const productId = items[index].productId;
    if (productId) {
      const prod = getProductDetails(productId);
      if (prod && quantity > prod.stockQuantity) {
        toast.error(`Cannot exceed available stock (${prod.stockQuantity}) for ${prod.name}`);
        return;
      }
    }

    const newItems = [...items];
    newItems[index].quantity = quantity;
    setItems(newItems);
  };

  // Mutation
  const mutation = useMutation({
    mutationFn: createSale,
    onSuccess: (data) => {
      toast.success(`Sale created successfully! Grand Total: ৳${data.data.grandTotal}`);
      navigate('/sales');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to create sale';
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (!customer) {
      toast.error('Please select a customer.');
      return;
    }

    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one valid product line.');
      return;
    }

    const payload = {
      customer,
      items: validItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/sales">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Create New Sale</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Selection */}
          <div className="space-y-2 max-w-sm">
            <label className="text-sm font-medium">Select Customer *</label>
            <Combobox
              options={customerOptions}
              value={customer}
              onChange={setCustomer}
              placeholder={isLoadingCustomers ? 'Loading...' : 'Search customer by name or phone...'}
              emptyText="No customer found."
            />
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[45%]">Product</TableHead>
                  <TableHead className="w-[15%]">Price</TableHead>
                  <TableHead className="w-[15%]">Quantity</TableHead>
                  <TableHead className="w-[15%] text-right">Subtotal</TableHead>
                  <TableHead className="w-[10%] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                  const prodDetails = getProductDetails(item.productId);
                  const price = prodDetails ? prodDetails.sellingPrice : 0;
                  const stock = prodDetails ? prodDetails.stockQuantity : 0;
                  const subtotal = subtotals[item.id] || 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Combobox
                          options={productOptions}
                          value={item.productId}
                          onChange={(val) => handleProductChange(index, val)}
                          placeholder={isLoadingProducts ? 'Loading...' : 'Select product...'}
                          emptyText="No product found."
                        />
                        {prodDetails && (
                          <div className="mt-1 flex items-center justify-between text-xs">
                            <span className="text-gray-500">SKU: {prodDetails.sku}</span>
                            <span className={stock < 10 ? 'text-red-500 font-medium' : 'text-green-600'}>
                              Stock: {stock}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        ৳{price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          max={stock || 1}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                          disabled={!item.productId}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{subtotal.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveLine(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={handleAddLine}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product Line
          </Button>

        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Grand Total</span>
            <span className="text-3xl font-bold text-blue-600">৳{grandTotal.toFixed(2)}</span>
          </div>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Processing...' : (
              <>
                <Save className="w-4 h-4 mr-2" /> Complete Sale
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateSale;
