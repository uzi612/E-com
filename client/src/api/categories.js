import api from './axios';

export const getCategoriesApi = async () => {
  const response = await api.get('/categories');
  return response.data;
};
