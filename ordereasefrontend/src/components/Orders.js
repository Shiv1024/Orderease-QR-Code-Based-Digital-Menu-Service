import React,{useEffect} from "react";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { repeatOrder,setCart,clearCart } from "../store/CartSlice";
import { useNavigate } from "react-router-dom";
import { fetchOrders, createOrder, deleteOrder, updateOrder,selectAllOrders, selectOrderByUserId  } from '../store/orderSlice';
import { getAllOrders, createOrder as createOrderAPI, deleteOrder as deleteOrderAPI, updateOrder as updateOrderAPI } from '../store/orderAPI';
import {selectUserId} from '../store/userslice.js';
import {clearCart as clearCartAPI, addToCart as addtoCartAPI} from '../store/cartAPI.js';
import { selectCart } from "../store/CartSlice";
const Orders = () => {
  const { history } = useSelector((state) => state);
  const cart = useSelector(selectCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const orders = useSelector(selectAllOrders);
  const token = localStorage.getItem('token');
  const specificOrder = useSelector((state) => selectOrderByUserId(state, '668717a297b30a17e8dce53c'));
  console.log(orders);
  console.log(userId,token);
  useEffect(() => {
    const fetchOrdersFromAPI = async () => {
      const data = await getAllOrders();
      const userOrders = data.filter(order => order.userId === userId);
      dispatch(fetchOrders(userOrders));
    };

    fetchOrdersFromAPI();
  }, [dispatch]);

  // console.log(history);

  const handleReorder = async (order) => {
    try {
      if (cart.items.length > 0) {
        await clearCartAPI(userId);
        // dispatch(clearCart()); 
        dispatch(setCart([]));
      }
      
  
      const itemsToRepeat = order.map((item) => ({
        userId: userId,
        dish: item.dish,
        amount: item.amount,
      }));
      
  
      const addItemsPromises = itemsToRepeat.map((item) =>
        addtoCartAPI(item.userId, {
          dish: item.dish,
          amount: item.amount,
        })
      );
  
      const responses = await Promise.all(addItemsPromises);
      responses.forEach((response) =>
        console.log("Added item to cart via API:", response.data)
      );
  
      setCart(itemsToRepeat);
  
      navigate("/cart"); // Navigate to the cart page after reordering
    } catch (error) {
      console.error("Failed to reorder:", error);
      // Handle error if needed
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-semibold text-gray-800 my-4">Order History</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.length === 0 && <p className="text-gray-600">No orders found.</p>}
          {orders && orders.map((order, index) => 
            
              (<div key={index} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                {/* <p className="text-gray-600">{order.currDate.toLocaleDateString()}</p> */}
                <p className='px-2 py-1 rounded-lg bg-green-200 text-green-800'>
                  Order Completed
                </p>
              </div>
              <div className="space-y-2">
                {order.items && order.items.map(item => (
                  <div key={item.dish.id} className="flex items-center space-x-4">
                    <img src={item.dish.image} alt={item.dish.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{item.dish.name}</h2>
                      <p className="text-gray-600">Price: ₹{item.dish.price}</p>
                      <p className="text-gray-600">Quantity: {item.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-4">
                {/* <p className="text-lg font-semibold text-gray-800">Total: {order.total} Rs</p> */}
                <p className="text-md md:text-lg lg:text-lg font-semibold text-gray-800">Total: ₹{order.amount}</p>
                <button onClick={() => handleReorder(order.items)} className="mt-2 text-sm px-3 py-2 md:px-4 md:py-2 md:text-base lg:px-4 lg:py-2 lg:text-base bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300">                  Reorder
                </button>
              </div>
              </div>)
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
