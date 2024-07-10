import { configureStore } from "@reduxjs/toolkit";
import CartReducer from "./CartSlice";
import UserReducer from "./userslice";
import HistoryReducer from "./OrderHistory";
import OrderReducer from "./orderSlice.js";

const store = configureStore({

    reducer: {
        cart: CartReducer,
        user: UserReducer,
        history: HistoryReducer,
        orders: OrderReducer
    }

});

export default store;