import axios from "axios";
import { updateCartFromAPI } from "../redux/CartSlice.js";

export const syncCart = async (accessToken, dispatch) => {
  if (!accessToken) return;

  try {
    const res = await axios.get("http://localhost:8000/api/v1/cart/getCart", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    if (res.data.success) {
      dispatch(
        updateCartFromAPI({
          items: res.data.cart.items,
          totalPrice: res.data.cart.totalPrice,
        })
      );
    }
  } catch (error) {
    console.log("Error syncing cart:", error);
  }
};
