import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setIsVerified,
  setName,
  setRole,
} from "../../redux/UserSlice";
import { syncCart } from "../../helper/syncCart";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const [otp, setOtp] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleOtp = async (e) => {
    e.preventDefault();
    console.log("userId", userId);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify-login",
        { userId: String(userId), otp: String(otp) },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        navigate("/");
        dispatch(setAccessToken(res.data.accessToken));
        dispatch(setIsVerified(res.data.user.isVerified));
        dispatch(setName(res.data.user.name));
        dispatch(setRole(res.data.user.role));

        await syncCart(res.data.accessToken, dispatch);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify otp", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#92487A] p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
          </div>

          <form onSubmit={handleOtp} className="p-6">
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Enter OTP:
              </label>
              <input
                ref={inputRef}
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea95cf] focus:border-transparent text-center text-lg tracking-wider"
                placeholder="••••••"
              />
              <p className="mt-2 text-gray-500 text-sm text-center">
                Enter the 6-digit code sent to your email or phone
              </p>
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ${
                otp.length === 6
                  ? "bg-[#92487A] hover:bg-[#75325f] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Verify OTP
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{" "}
                <a
                  href="#"
                  className="text-[#001BB7] hover:underline font-medium"
                >
                  Resend OTP
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
