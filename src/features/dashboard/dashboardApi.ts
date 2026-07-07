import axiosInstance from '../../lib/axios';

export interface LowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: LowStockProduct[];
}

export const getDashboardStats = async (): Promise<{ data: DashboardStats }> => {
  const response = await axiosInstance.get('/api/dashboard/stats');
  return response.data;
};
