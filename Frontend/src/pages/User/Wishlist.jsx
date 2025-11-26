import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const accessToken = useSelector((state) => state.user.accessToken);
  const [wishlistItems, setWishlistItems] = useState([]);

  const getWishlist = async (id) => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/wishlist/getWishlist",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);

      if (res.data.success) {
        setWishlistItems(res.data.wishlist);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (id) => {
    if (!accessToken) {
      return toast.error("Please login to add items to cart", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/addToCart",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getWishlist();
    }
  }, [accessToken]);

  const handleRemoveFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row"
              >
                {/* Product Image */}
                <div className="md:w-1/3 flex-shrink-0">
                  <img
                    src={item.image[0]?.url}
                    alt={item.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col justify-between md:w-2/3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 min-w-[140px]"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-300 min-w-[140px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
