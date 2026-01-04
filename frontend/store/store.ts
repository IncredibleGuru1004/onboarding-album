import { configureStore } from "@reduxjs/toolkit";
import appReducer from "@/store/counterSlice";
import categoryReducer from "@/store/categorySlice";
import authReducer from "@/store/authSlice";
import auctionReducer from "@/store/auctionSlice";
import uiReducer from "@/store/uiSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    categories: categoryReducer,
    auth: authReducer,
    auctions: auctionReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
