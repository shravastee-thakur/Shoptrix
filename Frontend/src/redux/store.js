// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import userSlice from "./UserSlice.js";

// // Persist config for the user slice only
// const persistConfig = {
//   key: "user",
//   storage,
//   whitelist: ["userId", "accessToken", "isVerified", "name"],
// };

// const persistedUserReducer = persistReducer(persistConfig, userSlice);

// export const store = configureStore({
//   reducer: {
//     user: persistedUserReducer, // Use the persisted reducer under 'user' key
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [
//           "persist/PERSIST",
//           "persist/REHYDRATE",
//           "persist/REGISTER",
//         ],
//       },
//     }),
// });

// const persistor = persistStore(store);
// export default persistor;

// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./UserSlice.js";

// Persist config for the user slice
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["userId", "accessToken", "isVerified", "name", "role"],
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
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
