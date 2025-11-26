import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

export const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
      state.totalQuantity = action.payload.items.length;
    },

    addToCartState: (state, action) => {
      const { productId, quantity } = action.payload;

      const existing = state.items.find(
        (item) => (item.productId._id || item.productId) === productId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }

      state.totalQuantity = state.items.length;
    },

    removeFromCartState: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );

      state.totalQuantity = state.items.length;
    },
    resetCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },

    clearCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalQuantity = 0;
    },

    // Add a new action to update cart from API response
    updateCartFromAPI: (state, action) => {
      const { items, totalPrice } = action.payload;
      state.items = items;
      state.totalPrice = totalPrice;
      state.totalQuantity = items.length;
    },
  },
});

export const {
  setCart,
  addToCartState,
  removeFromCartState,
  clearCartState,
  updateCartFromAPI,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
