import api from '../../lib/axios';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
}

export const getCustomers = async (params?: any) => {
  const response = await api.get('/api/customers', { params });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await api.get(`/api/customers/${id}`);
  return response.data;
};
