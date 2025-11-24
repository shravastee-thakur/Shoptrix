import { useState } from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { useDispatch, useSelector } from "react-redux";
import { setIsVerified } from "../redux/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { resetCart } from "../redux/CartSlice";

const Navbar = () => {
  const cartCount = useSelector((state) => state.cart.totalQuantity);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId, isVerified, name, accessToken, role } = useSelector(
    (state) => state.user
  );

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        { userId },
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

        dispatch(resetCart());

        dispatch(setIsVerified(false));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <nav className="bg-[#92487A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[65px]">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl md:text-2xl lg:text-3xl">
            <Link to={"/"}>Shoptrix</Link>
          </div>

          {/* Desktop Search Bar + Button */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex md:mx-6 lg:mx-8"
          >
            <div className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="px-4 py-2 rounded-l-lg text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 w-64 lg:w-80"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-r-lg flex items-center justify-center transition h-full"
                aria-label="Search"
              >
                <SearchSharpIcon />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <p className="hover:text-yellow-200 transition font-semibold">
                <Link to={"/all-products"}>Products</Link>
              </p>

              {isVerified ? (
                <div className="flex gap-6">
                  <Link to={"/user-page"}>
                    <p className="text-yellow-300 transition font-semibold">
                      Welcome,
                      <span className="font-bold"> {name}</span>
                    </p>
                  </Link>
                  {role === "admin" && (
                    <p className="hover:text-yellow-200 transition font-semibold">
                      <Link to="/admin">Admin</Link>
                    </p>
                  )}
                  <p
                    onClick={handleLogout}
                    className="hover:text-yellow-200 transition font-semibold cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              ) : (
                <p className="hover:text-yellow-200 transition font-semibold">
                  <Link to="/login">Login</Link>
                </p>
              )}

              {/* Cart Icon */}
              <p className="relative hover:text-yellow-200 transition font-semibold">
                <Link to={"/cart"}>
                  <ShoppingCartOutlinedIcon fontSize="medium" />
                </Link>
                {isVerified && cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Search */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3">
          {/* Mobile Search Form */}
          <form onSubmit={handleSearch} className="px-3">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 text-gray-800 placeholder-gray-500 text-sm rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white px-3 rounded-r-lg flex items-center justify-center"
                aria-label="Search"
              >
                <SearchSharpIcon />
              </button>
            </div>
          </form>
          {isVerified && (
            <p
              onClick={() => setIsOpen(!isOpen)}
              className="block px-3 py-2 rounded-md font-bold text-yellow-300"
            >
              <Link to={"/user-page"}> Welcome, {name}</Link>
            </p>
          )}

          <p
            onClick={() => setIsOpen(!isOpen)}
            className="block px-3 py-2 rounded-md font-semibold"
          >
            <Link to={"/all-products"}>Products</Link>
          </p>

          {isVerified ? (
            <p
              onClick={handleLogout}
              className="block px-3 py-2  font-semibold cursor-pointer"
            >
              Logout
            </p>
          ) : (
            <p
              onClick={() => setIsOpen(!isOpen)}
              className="block px-3 py-2  font-semibold"
            >
              <Link to={"/login"}>Login</Link>
            </p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
