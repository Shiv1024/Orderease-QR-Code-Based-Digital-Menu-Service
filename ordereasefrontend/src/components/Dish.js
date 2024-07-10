import React, { useState,useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { green} from '@mui/material/colors';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  getCart,
  addToCart as addToCartAPI,
  incrementItem as incrementItemAPI,
  decrementItem as decrementItemAPI,
  removeFromCart as removeFromCartAPI
} from '../store/cartAPI.js';
import {addToCart, removeFromCart, increment, decrement,setCart,selectCart} from "../store/CartSlice";
import { selectUserInfo,selectUserId } from '../store/userslice.js';
import { getUserById } from "../store/userAPI";
import { setUser, setError } from '../store/userslice';


const DishCard = (props) => {
  // const {cart} = useSelector((state) => state);
  const location = useLocation();
  const userId = useSelector(selectUserId);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const[present, setPresent] = useState(!cart.items.length || !(cart.items.some((product) => product.dish.id === props.id)) ? true : false);
  const getQuantity = () => {
    if(!present)
      {
        const productInCart = cart.items.find((product) => product.dish.id === props.item.id);
        return productInCart.amount;
      }
      else return 0;
  }
  const[quantity, setQuantity] = useState(getQuantity);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userInfo = await getUserById(token);
        dispatch(setUser({ userId: userInfo._id, userInfo: userInfo}));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };

    fetchUser();
  }, [dispatch]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        let cartData;
        if(userId)
          {
            cartData = await getCart(userId);
            dispatch(setCart(cartData)); 
          }else{
            const token = localStorage.getItem('token');
            cartData = await getCart(token);
            dispatch(setCart(cartData)); 
          }
        const productInCart = cartData.find((product) => product.dish.id === props.item.id);
        if (productInCart) {
          setQuantity(productInCart.amount);
          setPresent(false);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, [dispatch,props.amount,quantity]);

  const handleAddItem = async () => {
    try {
      if (quantity === 0) {
        await addToCartAPI(userId,{ dish: props.item, amount: 1 });
        dispatch(addToCart({ dish: props.item, amount: 1 }));
        setPresent(false);
      } else {
        await incrementItemAPI(userId,props.item.name);
        dispatch(increment({ dish: props.item }));
      }

      setQuantity(quantity + 1);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };
  const handleRemoveItem = async () => {
    try {
      if (quantity !== 1) {
        await decrementItemAPI(userId,props.item.name);
        dispatch(decrement({ dish: props.item }));
      } else {
        await removeFromCartAPI(userId,props.item.name);
        dispatch(removeFromCart({ dish: props.item }));
        setPresent(true);
      }

      setQuantity(quantity - 1);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };
  // const handledelete=(e)=>{
  //   axios.get('https://ordereasebackend.vercel.app/menu/categories')
  //   .then(response => {
  //   const categories = response.data;
  //   setCategories(categories);
  // })
  // .catch(error => console.error('Error fetching categories:', error));
  // }
  



  return (
 <div className="bg-white p-4 shadow-md rounded-lg mb-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-4">
        <div className="w-24 h-24 mr-4">
          <img src={props.image} alt={props.name} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold">{props.name}</h4>
          <p className="text-black-500 mt-1 font-bold">₹{props.price}</p>
          <p className="text-gray-600 mt-2">{props.description}</p>
          <p className="text-gray-500 text-sm mt-2">[{props.nutrients}]</p>
        </div>
      </div>
      
      {!props.admin && <div className="flex items-center justify-end">
        {cart && (quantity === 0) ? (
        <button
          className="text-gray-600 focus:outline-none bg-white-700 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center font-bold"
          style={{ color: green[700] }}
          onClick={handleAddItem}
        >
          ADD
        </button>
      ) : (
        <div className="flex items-center">
          <button
            className="text-gray-600 focus:outline-none  hover:bg-gray-300"
            onClick={handleRemoveItem}
          >
            <RemoveIcon style={{ color: green[700] }} />
          </button>
          <span className="mx-2 font-bold" style={{ color: green[700] }}>{quantity}</span>
          <button
            className="text-gray-600 focus:outline-none  hover:bg-gray-300"
            onClick={handleAddItem}
          >
            <AddIcon style={{ color: green[700] }} />
          </button>
        </div>
      )}
      </div>}

      {props.admin && <div className="flex items-center justify-end">
        <button
          className="text-red-600 focus:outline-none bg-white-700 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center font-bold"
          onClick={() => props.handleDelete(props.id)}
        >
          DELETE
        </button>
    </div>}
    </div>
  );
};

export default DishCard;
