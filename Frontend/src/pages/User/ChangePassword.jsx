import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const { userId, accessToken } = useSelector((state) => state.user);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    console.log("accessToken", accessToken);
    console.log("userId", userId);

    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/change-password",
        { userId, oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
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
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-[#92487A] p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="p-6">
            {/* Old Password */}
            <div className="mb-5">
              <label
                htmlFor="oldPassword"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Old Password:
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea95cf] focus:border-transparent"
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    showOldPassword ? "Hide old password" : "Show old password"
                  }
                >
                  {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
            </div>

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
                  type={showNewPassword ? "text" : "password"}
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
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                >
                  {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#92487A] hover:bg-[#75325f] text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
