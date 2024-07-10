import React, {useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import Navbar from './Navbar';
import { selectUserInfo,selectUserId } from '../store/userslice.js';
import {useNavigate } from 'react-router-dom';
import { addToHistory } from '../store/OrderHistory';
import {clearCart, setCart} from "../store/CartSlice";
import { toast } from 'react-toastify';
import { clearCart as clearCartAPI } from '../store/cartAPI.js';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';


const CheckoutPage = () => {
  const { cart } = useSelector((state) => state);
  const TAX_RATE = 0.1; 
  const DISCOUNT = 0.05;
  const userId = useSelector(selectUserId);
  const userInfo = useSelector(selectUserInfo);

  const calculateTotal = () => {
    let subtotal = 0;
    cart.items.forEach((item) => {
      subtotal += item.amount * item.dish.price;
    });
    return subtotal;
  };

  const subtotal = calculateTotal();
  const tax = subtotal * TAX_RATE;
  const discount = subtotal * DISCOUNT;
  const total = subtotal + tax - discount;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [processing, setProcessing] = useState(false);

  

    const handlePaymentSubmit = async (event) => {
      event.preventDefault();
      if (!stripe || !elements) {
  
        return;
      }
  
      try {
        setProcessing(true);
        const paymentIntentResponse = await axios.post('https://ordereasebackend.vercel.app/api/payment/create-payment-intent', {
          amount: Math.round(total),
          currency: 'usd', 
          userId: userId,
          userEmail: userInfo.email,
          food: cart.items.map(item => item.dish.name).join(', '),
          items: cart.items,
          name: userInfo.name,
          total: total,
          orderType: userInfo.selectedOption,
          tableNo: userInfo.tableNo,
          selectedAddress: userInfo.selectedAddress,
          orderStatus: ''
        }); 
  
        const clientSecret = paymentIntentResponse.data.clientSecret;
  
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userInfo.name, // Replace with actual userInfo name
            },
          },
        });
        
        if (error) {
          setPaymentError(error.message);
          console.error('Payment failed:', error);
          setProcessing(false);
        } else {
          if (paymentIntent.status === 'succeeded') {
            const cart = await clearCartAPI(userId);
            // dispatch(clearCart());
            dispatch(setCart([]));
            console.log(cart);
            toast.success('Order Placed!');
            navigate("/feedback");
          }
        }
      } catch (error) {
        setPaymentError('Payment failed. Please try again.');
        console.error('Error:', error);
        setProcessing(false);
      }
    };
  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen bg-gray-100 mx-auto py-8">
        <div className="flex justify-center items-start">
        <div className="w-3/4 md:w-1/2 lg:w-1/2 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 mb-6">Checkout</h2>
            <div className="mb-6">
            <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>              {cart.items.map((item) => (
                <div key={item.dish.id} className="flex justify-between items-center mb-2">
                  <p className="text-gray-800">{item.dish.name} x {item.amount}</p>
                  <p className="text-gray-800">₹{item.amount * item.dish.price}</p>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between items-center mb-2">
              <p className="text-sm md:text-base lg:text-base text-gray-800 font-semibold">Subtotal</p>
              <p className="text-sm md:text-base lg:text-base text-gray-800 font-semibold">₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
              <p className="text-sm md:text-base lg:text-base text-gray-800">Tax (10%)</p>
              <p className="text-sm md:text-base lg:text-base text-gray-800">₹{tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
              <p className="text-sm md:text-base lg:text-base text-gray-800">Discount</p>
              <p className="text-sm md:text-base lg:text-base text-gray-800">- ₹{discount.toFixed(2)}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-gray-800">Total</p>
                <p className="text-xl font-semibold text-gray-800">₹{total.toFixed(2)}</p>
              </div>
            </div>
             {/* Payment form */}
             <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>                <div className="mb-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {paymentError && <div className="text-red-500">{paymentError}</div>}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!stripe || processing}
                  className="bg-green-600 text-white text-sm px-4 py-2 md:px-6 md:py-3 md:text-base lg:px-6 lg:py-3 lg:text-base rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                >
                  {processing ? 'Processing...' : 'Confirm and Pay'}
                </button>
              </div>
            </form>
            {/* <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>
              <div className="mb-4">
                <select
                  id="paymentMethod"
                  className="w-1/2 md:w-1/3 lg:w-1/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"                >
                  <option value="creditCard">Credit Card</option>
                  <option value="debitCard">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
            </div> */}

            {/* <div className="mb-6">
<h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-4">Discount Code</h3>              <div className="flex">
                <input
                  type="text"
                  id="discountCode"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter discount code"
                />
                <button className="ml-2 bg-blue-600 text-white text-sm px-4 py-1 md:px-4 md:py-2 md:text-base lg:px-6 lg:py-2 lg:text-base rounded-lg hover:bg-blue-700 transition duration-300">
                  Apply
                </button>
              </div>
            </div> */}

            {/* <div className="flex justify-center">
              <button onClick={handleCheckout} className="bg-green-600 text-white text-sm px-4 py-2 md:px-6 md:py-3 md:text-base lg:px-6 lg:py-3 lg:text-base rounded-lg font-semibold hover:bg-green-700 transition duration-300">
                Confirm and Pay
              </button>
             
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;