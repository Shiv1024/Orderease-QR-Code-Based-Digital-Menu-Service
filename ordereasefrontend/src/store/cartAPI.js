import axios from 'axios';


export const getCart = async (userId) => {
  const response = await axios.get(`https://ordereasebackend.vercel.app/cart/${userId}`);
  return response.data;
};

export const addToCart = async (userId,item) => {
  const response = await axios.post(`https://ordereasebackend.vercel.app/cart/${userId}`, item);
  return response.data;
};

export const removeFromCart = async (userId,name) => {
  console.log(name);
  const response = await axios.delete(`https://ordereasebackend.vercel.app/cart/${userId}/${name}`);
  return response.data;
};
export const incrementItem = async (userId,name) => {
  const response = await axios.put(`https://ordereasebackend.vercel.app/cart/${userId}/increment`, { name: name });
  return response.data;
};

export const decrementItem = async (userId,name) => {
  const response = await axios.put(`https://ordereasebackend.vercel.app/cart/${userId}/decrement`, { name: name });
  return response.data;
};

export const clearCart = async (userId) => {
  const patchData = "Nothing to add, just to clear the cart"; 
  try {
    const response = await axios.patch(`https://ordereasebackend.vercel.app/cart/${userId}`, patchData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating user data');
  }
};

