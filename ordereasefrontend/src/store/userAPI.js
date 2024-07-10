import axios from 'axios';


export const fetchUser = async (userId) => {
  try {
    const response = await axios.get(`https://ordereasebackend.vercel.app/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error fetching user data');
  }
};

export const getUserById = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.get(`https://ordereasebackend.vercel.app/auth/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  console.log(userId,userData);
  try {
    const response = await axios.patch(`https://ordereasebackend.vercel.app/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating user data');
  }
};

// export const deleteUser = async (userId) => {
//   try {
//     const response = await axios.delete(`https://ordereasebackend.vercel.app/users/${userId}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response.data.message || 'Error deleting user data');
//   }
// };
