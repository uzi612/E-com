import api from './axios';

export const getProductsApi = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.category && params.category !== 'All') {
    queryParams.append('category', params.category);
  }
  if (params.search && params.search.trim()) {
    queryParams.append('search', params.search.trim());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/products?${queryString}` : '/products';
  const response = await api.get(url);
  return response.data;
};

export const getProductByIdApi = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
