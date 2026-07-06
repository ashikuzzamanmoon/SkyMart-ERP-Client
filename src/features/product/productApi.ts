import api from '../../lib/axios';

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
}

export const getProducts = async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
  const { data } = await api.get('/api/products', { params });
  return data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/api/products/${id}`);
  return data.data; 
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const { data } = await api.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const updateProduct = async ({ id, formData }: { id: string; formData: FormData }): Promise<Product> => {
  const { data } = await api.patch(`/api/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/products/${id}`);
};
