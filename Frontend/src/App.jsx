import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
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

const App = () => {
  return (
    <div className="bg-gray-100 ">
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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
