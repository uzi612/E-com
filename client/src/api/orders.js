import api from './axios';

export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrdersApi = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

export const getAllOrdersApi = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateOrderStatusApi = async (id, status) => {
  const response = await api.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};
