import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
  },
  reducers: {
    fetchOrders: (state, action) => {
      state.orders = action.payload;
    },
    createOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter((order) => order.userId !== action.payload);
    },
    updateOrder: (state, action) => {
      const index = state.orders.findIndex((order) => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
  },
});

export const { fetchOrders, createOrder, deleteOrder, updateOrder } = orderSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.orders;
export const selectOrderByUserId = (state, userId) => 
  state.orders.orders.find(order => order.userId === userId);

export default orderSlice.reducer;
