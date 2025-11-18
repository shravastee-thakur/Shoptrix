import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const Login = () => {
  //   const navigate = useNavigate();
  //   const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setUser({
  //       ...user,
  //       [name]: value,
  //     });
  //     console.log(user);
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const success = await login(user);
  //     if (success) {
  //       setUser({ email: "", password: "" });
  //       navigate("/");
  //     }
  //   };

  return (
    <section className="my-3 mt-4 lg:mt-20 flex justify-center items-center">
      <div className="relative w-10/12 sm:w-3/4 md:w-2/5 lg:w-1/4 border-2 p-4 md:p-4 bg-white shadow-xl rounded-lg overflow-hidden">
        <h1 className="text-center mt-3 text-2xl font-bold text-[#92487A]">
          Login
        </h1>

        <form className="p-4">
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              //   onChange={handleChange}
              className="border p-2 rounded-lg bg-white"
              type="email"
              placeholder="Enter your email"
              name="email"
              //   value={user.email}
            />
          </div>

          <div className="flex flex-col gap-1 mt-2 relative">
            <label className="text-sm font-semibold">Password</label>
            <input
              //   onChange={handleChange}
              className="border p-2 rounded-lg bg-white"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              //   value={user.password}
            />
            <div className="absolute top-8 right-3">
              {!showPassword ? (
                <VisibilityOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  fontSize="small"
                />
              ) : (
                <VisibilityIcon
                  onClick={() => setShowPassword(!showPassword)}
                  fontSize="small"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <button
              type="submit"
              className="bg-[#92487A] hover:bg-[#75325f] text-white font-bold p-2 rounded-lg cursor-pointer"
            >
              Login
            </button>
            <p className="mt-2 text-center text-sm">
              Don't have an account?
              {/* <NavLink
                className="text-indigo-600 font-semibold"
                to={"/register"}
              >
                Register
              </NavLink> */}
            </p>
            <p className="mt-2 text-left text-xs">
              Admin: shratestcode@gmail.com <br /> Password: shra6789{" "}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
