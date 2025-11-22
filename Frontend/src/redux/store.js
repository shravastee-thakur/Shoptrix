// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userSlice from "./UserSlice.js";
import cartSlice from "./CartSlice.js";

// Persist config for the user slice
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["userId", "accessToken", "isVerified", "name", "role"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalQuantity"],
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
