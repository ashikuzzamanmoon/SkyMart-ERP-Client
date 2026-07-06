import axiosInstance from '../../lib/axios';

export const loginUser = async (credentials: Record<string, string>) => {
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  // Not required for now, we just remove the access token in frontend
  // But could be used to blacklist refresh token on backend if endpoint exists
};
