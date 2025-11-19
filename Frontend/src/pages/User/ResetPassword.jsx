import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("id");

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = newPassword.length >= 6;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/reset-password",
        { userId, token, newPassword },
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#92487A] p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Set New Password</h2>
          </div>

          <form onSubmit={handleResetPassword} className="p-6">
            {/* New Password */}
            <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                New Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea95cf] focus:border-transparent"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
              <p className="mt-2 text-gray-500 text-sm">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full font-bold py-2 px-4 rounded-md transition duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-[#92487A] hover:bg-[#75325f] text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Setting Password..." : "Set New Password"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?
                <span className="text-[#001BB7] hover:underline font-medium">
                  Back to Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
