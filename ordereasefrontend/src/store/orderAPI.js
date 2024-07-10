import axios from 'axios';

export const getAllOrders = async () => {
  const response = await axios.get('https://ordereasebackend.vercel.app/orders');
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await axios.post('https://ordereasebackend.vercel.app/orders', orderData);
  return response.data;
};

export const deleteOrder = async (userId) => {
  const response = await axios.delete(`https://ordereasebackend.vercel.app/orders/${userId}`);
  return response.data;
};

export const updateOrder = async (userId, updatedOrderData) => {
  const response = await axios.patch(`https://ordereasebackend.vercel.app/orders/${userId}`, updatedOrderData);
  return response.data;
};