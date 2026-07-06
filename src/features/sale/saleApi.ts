import api from '../../lib/axios';

export interface SaleItemPayload {
  product: string;
  quantity: number;
}

export interface CreateSalePayload {
  customer: string;
  items: SaleItemPayload[];
}

export const getSales = async (params?: any) => {
  const response = await api.get('/api/sales', { params });
  return response.data;
};

export const getSaleById = async (id: string) => {
  const response = await api.get(`/api/sales/${id}`);
  return response.data;
};

export const createSale = async (payload: CreateSalePayload) => {
  const response = await api.post('/api/sales', payload);
  return response.data;
};
