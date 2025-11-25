import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/User/Register";
import VerifyEmail from "./pages/User/VerifyEmail";
import Login from "./pages/User/Login";
import VerifyOtp from "./pages/User/VerifyOtp";
import ChangePassword from "./pages/User/ChangePassword";
import ForgetPassword from "./pages/User/ForgetPassword";
import ResetPassword from "./pages/User/ResetPassword";
import { Toaster } from "react-hot-toast";
import Admin from "./pages/Admin/Admin";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken, setRole, logout } from "./redux/UserSlice";
import ProductPage from "./pages/Products/Allproducts";
import ProductDetailPage from "./pages/Products/ProductDetails";
import Cart from "./pages/Products/Cart";
import SearchProducts from "./pages/Products/SearchProducts";
import AddressPage from "./pages/User/UserProfile/AddressPage";
import UserDetail from "./pages/User/UserProfile/UserDetails";
import MyOrders from "./pages/User/UserProfile/MyOrders";

const App = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const [isTokenRefreshed, setIsTokenRefreshed] = useState(false);

  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/refresh-handler",
          {},
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAccessToken(res.data.accessToken));
          dispatch(setRole(res.data.user.role));
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Token refresh failed:", error);
        }
        // If refresh fails, clear the expired token
        dispatch(logout());
      } finally {
        setIsTokenRefreshed(true);
      }
    };

    // ALWAYS try to refresh token on app load, regardless of existing accessToken
    getRefreshToken();
  }, [dispatch]);

  // Show loading while refreshing token
  if (!isTokenRefreshed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100">
      <div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-login" element={<VerifyOtp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/all-products" element={<ProductPage />} />
          <Route path="/product-detail/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address-page" element={<AddressPage />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/user-details" element={<UserDetail />} />
          <Route path="/user-orders" element={<MyOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
