import React, { useState, useEffect } from "react";
import NavbarAdmin from "./Navbaradmin";
import { useSelector, useDispatch } from "react-redux";
import { repeatOrder } from "../store/CartSlice";
import { useNavigate } from "react-router-dom";
import {
  fetchOrders,
  createOrder,
  deleteOrder,
  updateOrder,
  selectAllOrders,
  selectOrderByUserId,
} from "../store/orderSlice";
import {
  getAllOrders,
  createOrder as createOrderAPI,
  deleteOrder as deleteOrderAPI,
  updateOrder as updateOrderAPI,
} from "../store/orderAPI";
import { selectUserId, selectUserInfo } from "../store/userslice.js";

const Admin = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userInfo = useSelector(selectUserInfo);
  const orders = useSelector(selectAllOrders);
  useEffect(() => {
    const fetchOrdersFromAPI = async () => {
      const data = await getAllOrders();
      dispatch(fetchOrders(data));
    };

    fetchOrdersFromAPI();
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(userId, newStatus);
    const data = await updateOrderAPI(orderId, { orderStatus: newStatus });
    dispatch(updateOrder(data));
  };
  return (
    <div>
      <NavbarAdmin />
      <div className="w-screen min-h-screen bg-gray-100 mx-auto py-8">
        <div className="flex justify-center items-start">
          <div className="w-11/12 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-6">
              Orders
            </h2>{" "}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Order Type
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Table No.
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Customer Name
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Items Ordered
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Total Price
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base font-medium text-gray-700"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.slice().reverse().map((order) => (
                    <tr key={order.id}>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        #{order._id}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        {order.orderType || "Dine"}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        {order.orderType == "Dine-in" ? order.tableNo : "-"}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        {order.name || order.userEmail}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        {order.items.map((item) => (
                          <div key={item._id}>
                            {item.dish.name} x {item.amount || 1}
                          </div>
                        ))}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        ₹{order.amount}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        {order.orderType == "Home Delivery"
                          ? `Delivered at ${order.selectedAddress}`
                          : `Payment recieved ₹${order.amount}`}
                      </td>
                      <td className="text-xs px-3 py-1 text-left md:px-4 md:py-2 md:text-sm lg:px-4 lg:py-2 lg:text-base whitespace-nowrap">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="text-sm md:text-base lg:text-base border rounded-lg p-2"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing Order">
                            Preparing Order
                          </option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Order Completed">
                            Order Completed
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="flex justify-center items-center mt-6">
                  <p className="text-gray-600 text-sm md:text-base lg:text-base">
                    No orders to display
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
