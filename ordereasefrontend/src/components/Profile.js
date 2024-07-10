import React, { useState } from 'react';
import Navbar from './Navbar';
import { selectUserInfo, selectUserId, setUser, setError } from '../store/userslice';
import { useSelector, useDispatch } from 'react-redux';
import { getUserById } from "../store/userAPI";
import { useEffect } from 'react';
import { updateUser } from '../store/userAPI';



const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  console.log(userInfo);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo && userInfo.name,
    email: userInfo && userInfo.email,
    number: userInfo && userInfo.number,
  });
    const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
        ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    try {
        const token = localStorage.getItem('token');
        const userInfo = await updateUser(token, formData);
        dispatch(setUser({ userId: userInfo._id, userInfo: userInfo }));
        localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Save userInfo to local storage
        setEditMode(false);
        alert("Profile Updated!");
      } catch (error) {
        dispatch(setError(error.message));
      }
    
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userInfo = await getUserById(token);
        dispatch(setUser({ userId: userInfo._id, userInfo: userInfo }));
        localStorage.setItem('userInfo', JSON.stringify(userInfo)); // Save userInfo to local storage
      } catch (error) {
        dispatch(setError(error.message));
      }
    };
    fetchUser();
  }, [dispatch]);

 

  return (
    <div>
    <Navbar />
    <div className="bg-slat flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-xl w-full p-8 mx-4 bg-white rounded-lg shadow-md">
       <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">User Profile</h1>        
       {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder={userInfo && userInfo.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder={userInfo && userInfo.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                Number:
              </label>
              <input
                type="text"
                id="number"
                name="number"
                value={formData.number}
                placeholder={userInfo && userInfo.number}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="mr-4 text-sm px-4 py-2 md:px-6 md:py-3 md:text-base lg:px-6 lg:py-3 lg:text-base bg-green-700 hover:bg-green-800 text-white rounded-md"              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="ml-4 text-sm px-4 py-2 md:px-6 md:py-3 md:text-base lg:px-6 lg:py-3 lg:text-base bg-gray-600 text-white rounded-md"              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className='bg-white'>
            <p className="text-lg mb-4">
              <strong>Name:</strong> {userInfo && userInfo.name}
            </p>
            <p className="text-lg mb-4">
              <strong>Email:</strong> { userInfo && userInfo.email}
            </p>
            <p className="text-lg mb-4">
              <strong>Number:</strong> { userInfo && userInfo.number}
            </p>
            <div className="text-center">
              <button
                onClick={() => setEditMode(true)}
                className="text-sm px-4 py-2 md:px-6 md:py-3 md:text-base lg:px-6 lg:py-3 lg:text-base bg-green-700 hover:bg-green-800 text-white rounded-md"              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;
