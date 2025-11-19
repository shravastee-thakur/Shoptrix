import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import axios from "axios";


const VerifyEmail = () => {

  const [searchParams] = useSearchParams();
  const otp = searchParams.get("otp");
  const rawEmail = searchParams.get("email");
  const email = rawEmail ? decodeURIComponent(rawEmail) : null;

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [hasVerified, setHasVerified] = useState(false);

  const verify = async () => {
    if (hasVerified) return;

    if (!otp || !email) {
      setStatus("error");
      setMessage("Invalid verification link. Missing email or OTP.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify-email",
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        console.log(res.data);
        setHasVerified(true);
        setStatus("success");
        setMessage("Your email has been verified! Your account is now active.");
      } else {
        setStatus("error");
        setMessage(
          res.data.message ||
            "Verification failed. The link may be invalid or expired."
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        "An error occurred while verifying your email. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!otp || !email) return;
    verify();
  }, []);

  if (status === "verifying") {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FA812F] mb-4"></div>
          <p className="text-gray-700">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white shadow-xl rounded-lg p-8">
          {status === "success" ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DoneSharpIcon className="text-green-700" fontSize="large" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="inline-block bg-[#92487A] hover:bg-[#75325f] text-white font-bold py-2 px-6 rounded-md transition">
                <Link to={"/login"}>Go to Login</Link>
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClearOutlinedIcon className="text-red-500" fontSize="large" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
