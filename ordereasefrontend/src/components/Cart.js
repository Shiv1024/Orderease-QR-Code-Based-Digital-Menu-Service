import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, increment, decrement, setCart } from "../store/CartSlice";
import { selectUserInfo, selectUserId, setUser, setError } from '../store/userslice';
import {
  getCart,
  incrementItem as incrementItemAPI,
  decrementItem as decrementItemAPI,
  removeFromCart as removeFromCartAPI
} from '../store/cartAPI';
import { getUserById,updateUser } from "../store/userAPI";
import { Button } from '@mui/material';

const CartPage = () => {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state);
  const userId = useSelector(selectUserId);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedOption, setSelectedOption] = useState('Home Delivery');
  const [table, setTable] = useState("Select Table Number");
  const [quantity, setQuantity] = useState(false);
  const [showAddAddressPopup, setShowAddAddressPopup] = useState(false);
  const [newAddress, setNewAddress] = useState({ houseNumber: '', area: '', city: '' });
  
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if(userId)
        {
          const cartData = await getCart(userId);
          dispatch(setCart(cartData)); 
        }else{
          const token = localStorage.getItem('token');
          const cartData = await getCart(token);
          dispatch(setCart(cartData)); 
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, [dispatch, quantity]);

  const totalPrice = () => {
    return cart.items.reduce((total, item) => total + item.amount * item.dish.price, 0);
  };

  const handleIncrement = async (item) => {
    try {
      await incrementItemAPI(userId, item.name);
      dispatch(increment({ dish: item }));
      setQuantity((prev) => !prev);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleDecrement = async (item, amt) => {
    try {
      if (amt !== 1) {
        await decrementItemAPI(userId, item.name);
        dispatch(decrement({ dish: item }));
        setQuantity((prev) => !prev);
      } else {
        await removeFromCartAPI(userId, item.name);
        dispatch(removeFromCart({ dish: item }));
        setQuantity((prev) => !prev);
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleDeleteAddress = async (fulladdress) => {
    const newUserAddress = userInfo.address.filter((addr) => addr !== fulladdress);
    console.log(newUserAddress);
    try {
      const updatedUser = await updateUser(userId, { address: [...newUserAddress] });
      console.log("Updated user info:", updatedUser);
      dispatch(setUser({ userId: updatedUser._id, userInfo: updatedUser }));
      alert("Address Deleted!");
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch(setError(error.message));
    }
  };

  // const handleAddAddress = async (e) => {
  //   e.preventDefault();
  //   console.log("atlease i was called",newAddress);
  //     const address = `${newAddress.houseNumber}, ${newAddress.area}, ${newAddress.city}`;
  //     console.log(address);
  //     try {
  //       const userInfo = await updateUser(userId, {"address": [...userInfo.address, address]});
  //       dispatch(setUser({ userId: userInfo._id, userInfo: userInfo }));
  //       alert("Address Added!");
  //       setNewAddress({ houseNumber: '', area: '', city: '' });
  //       setShowAddAddressPopup(false);
  //     } catch (error) {
  //       dispatch(setError(error.message));
  //     }
  // };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const address = `${newAddress.houseNumber}, ${newAddress.area}, ${newAddress.city}`;
    try {
      const updatedUser = await updateUser(userId, { address: [...userInfo.address, address] });
      console.log("Updated user info:", updatedUser);
      dispatch(setUser({ userId: updatedUser._id, userInfo: updatedUser }));
      alert("Address Added!");
      setNewAddress({ houseNumber: '', area: '', city: '' });
      setShowAddAddressPopup(false);
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch(setError(error.message));
    }
  };
  
  const handleTableChange = (event) => {
    setTable(event.target.value);
  };

  const handleCheckout = async () => {
    try {
      if(selectedOption=== 'Home Delivery'){
        if(selectedAddress === ''){
          alert("Please select an address for delivery");
        }
        else{
          const updatedUser = await updateUser(userId, { selectedOption:'Home Delivery',selectedAddress:selectedAddress });
          console.log("Updated user info:", updatedUser);
          dispatch(setUser({ userId: updatedUser._id, userInfo: updatedUser }));
          setSelectedAddress('');

        }
      }
      else if(selectedOption === 'Dine-in'){
        if(table === 'Select Table Number'){
          alert("Please select a table number for dine-in");
        }
        else{
          const updatedUser = await updateUser(userId, { selectedOption:'Dine-in',tableNo:table });
          console.log("Updated user info:", updatedUser);
          dispatch(setUser({ userId: updatedUser._id, userInfo: updatedUser }));
          setTable('Select Table Number');
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen bg-gray-100 mx-auto py-8 px-4 md:px-8 lg:px-16">
      <div className="flex flex-col lg:flex-row justify-between items-start w-full">
          <div className="w-full lg:w-1/2 lg:mb-0 lg:ml-10">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Details</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                  <img src="https://cdn-icons-png.flaticon.com/512/4715/4715330.png" alt="Profile" className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{userInfo && userInfo.name}</p>
                  <p className="text-gray-600">{userInfo && userInfo.email}</p>
                  <p className="text-gray-600">{userInfo && userInfo.number}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex space-x-4 mb-4">
                <button 
                  className={`px-4 py-2 rounded-lg font-semibold ${selectedOption === 'Home Delivery' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedOption('Home Delivery')}
                >
                  Home Delivery
                </button>
               
                <button 
                  className={`px-4 py-2 rounded-lg font-semibold ${selectedOption === 'Dine-in' ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setSelectedOption('Dine-in')}
                >
                  Dine-in
                </button>
              </div>

              {selectedOption === 'Home Delivery' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
                  {userInfo && userInfo.address.map((addr,index) => (
                    <div key={index} className="flex items-center justify-between mb-4">
                      <p className="text-gray-800">{addr}</p>
                      <div className="flex space-x-2">
                        <button
                          className={`text-red-700 px-3 py-1 rounded-lg border border-red-700 font-semibold hover:bg-red-700 hover:text-white transition duration-300`}
                          onClick={() => handleDeleteAddress(addr)}
                        >
                          Delete
                        </button>
                        <button 
                        onClick={() => setSelectedAddress(addr)}
                        className={`${selectedAddress === addr ? 'bg-green-700 text-white' : 'bg-white text-green-700'} px-3 py-1 rounded-lg border border-green-700 font-semibold hover:bg-green-700 hover:text-white transition duration-300`}>
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddAddressPopup(true)}
                    className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition duration-300"
                  >
                    Add Address
                  </button>

                  {showAddAddressPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Address</h2>

                        <div className="mb-4">
                          <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">House Number</label>
                          <input
                            type="text"
                            id="houseNumber"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={newAddress.houseNumber}
                            onChange={(e) => setNewAddress({ ...newAddress, houseNumber: e.target.value })}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
                          <input
                            type="text"
                            id="area"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={newAddress.area}
                            onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            id="city"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          />
                        </div>
                        <div className="flex justify-center">
                          <button
                           type='submit'
                            onClick={handleAddAddress}
                            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddAddressPopup(false)}
                            className="ml-2 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

           

              {selectedOption === 'Dine-in' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Dine-in</h2>
                  {/* Dine-in option: Add table number dropdown */}
                  <div className="mb-4">
                    <select
                      id="tableNumber"
                      className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                      onChange={handleTableChange}
                      value={table}
                    >
                      <option key='0' value='0'>Select Table Number</option>
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i+1} value={i+1}>Table {i+1}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {cart.items.length ? (
            <div className="w-full md:w-1/3 mr-10 md:mr-0 mt-6 md:mt-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Cart Summary</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Item</th>
                        <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                        <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                      </tr>
                    </thead>
                    {cart.items && cart.items.map((temp) => (
                      <tbody key={temp.dish.id} className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2 whitespace-nowrap">{temp.dish.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex">
                            <div className="bg-gray-200 border-2 text-orange-700 rounded-lg border-orange-700">
                              <button className="text-lg focus:outline-none bg-white-700 hover:bg-gray-300 px-2 rounded-lg font-bold" onClick={() => handleDecrement(temp.dish, temp.amount)}>-</button>
                              {temp.amount}
                              <button className="text-lg focus:outline-none bg-white-700 hover:bg-gray-300 px-2 rounded-lg font-bold" onClick={() => handleIncrement(temp.dish)}>+</button>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">₹{(temp.amount) * (temp.dish.price)}</td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <label htmlFor="total" className="ml-4 block text-sm font-medium text-gray-700">Total:</label>
                    <p id="total" className="ml-4 text-xl font-semibold text-gray-800">₹{totalPrice()}</p>
                  </div>
                  {(selectedAddress !== '' || table !== 'Select Table Number') && <Link to="/checkout" onClick={handleCheckout} className="mr-4 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">Checkout</Link>}
                  {!(selectedAddress !== '' || table !== 'Select Table Number') && <Button className="mr-4 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">Please Select Table No./Address</Button>}
                </div>
              </div>
            </div>
          ) : (
              <div className="w-full md:w-1/3 flex justify-center items-center mr-12 md:mr-0 mt-6 md:mt-0">
                <div className="w-full flex flex-col justify-center items-center h-40vh bg-white rounded-lg shadow-md p-6">
                <img
                  src="/carts.png"
                  alt="Empty Cart"
                  className="w-24 h-24 mb-4"
                />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-4">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/menu">
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300">
                    Start Ordering
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
