import { useEffect, useState } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateCartFromAPI, addToCartState } from "../../redux/CartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { isVerified, accessToken } = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState("");

  const getCartItems = async () => {
    if (!isVerified) return;
    try {
      const res = await axios.get("http://localhost:8000/api/v1/cart/getCart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data);

      if (res.data.success) {
        setCartItems(res.data.cart.items);
        setSubTotal(res.data.totalPrice);

        dispatch(
          updateCartFromAPI({
            items: res.data.cart.items,
            totalPrice: res.data.totalPrice,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getCartItems();
    }
  }, [accessToken]);

  // Update quantity
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await axios.put(
        "http://localhost:8000/api/v1/cart/updateCart",
        { productId, quantity: newQty },
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
        getCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/cart/removeFromCart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        await getCartItems();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerateOrder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/order/createOrder",
        {},
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
        setOrderId(res.data.order._id);
        setShowModal(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shipping = subtotal > 500 ? 0 : 80;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <ShoppingCartOutlinedIcon sx={{ fontSize: 80, color: "#D34E4E" }} />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mt-2 max-w-md">
            Looks like you haven’t added anything yet.
          </p>
          <Link to={"/all-products"}>
            <button className="mt-6 bg-[#D34E4E] hover:bg-[#cf3f3f] text-white px-3 lg:px-6  py-1 lg:py-3 rounded-md transition">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {/* Cart Items + Summary */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.productId._id}
                    className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4"
                  >
                    <img
                      src={item.productId.image[0]?.url}
                      alt={item.productId.title}
                      className="h-19 w-auto md:h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.productId.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        ₹{item.productId.price.toLocaleString()}
                      </p>
                      {/* Stock Message */}
                      {(() => {
                        const totalStock = item.productId.totalStock;
                        const quantity = item.quantity;
                        const remaining = totalStock - quantity;

                        if (remaining === 0) {
                          return (
                            <p className="text-red-600 font-semibold mt-1">
                              Out of stock
                            </p>
                          );
                        }

                        if (remaining > 0 && remaining < 3) {
                          return (
                            <p className="text-orange-600 font-medium mt-1">
                              Only {remaining} left!
                            </p>
                          );
                        }

                        return null;
                      })()}

                      <div className="flex items-center mt-4">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId._id,
                              item.quantity - 1
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center border-t border-b">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId._id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.productId.totalStock}
                          className={`px-3 py-1 rounded-r ${
                            item.quantity >= item.productId.totalStock
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => removeItem(item.productId._id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <DeleteForeverOutlinedIcon fontSize="large" />
                      </button>
                      <p className="font-semibold text-lg mt-4">
                        ₹
                        {(
                          item.productId.price * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* order modal */}

            {showModal && (
              <div className=" w-[400px] h-[200px] bg-yellow-50 rounded-xl flex flex-col justify-center items-center gap-4 z-30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div>
                  <h2 className="text-xl text-center font-bold">
                    Your order No. <br /> {orderId}
                  </h2>
                  <p className="mt-2 text-center">
                    You can pay with card or UPI
                  </p>
                  <p className="text-center">Thank you for shopping with us.</p>
                </div>
                <div>
                  <div>
                    <button
                      onClick={async () => {
                        setShowModal(false);
                        await getCartItems();
                      }}
                      className="bg-blue-700 text-white px-6 py-1 rounded"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white p-6 rounded-lg shadow sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateOrder}
                  className="w-full mt-6 bg-[#D34E4E] hover:bg-[#cf3f3f] text-white py-3 rounded-md transition"
                >
                  Place Order
                </button>
                <button className="w-full mt-3 text-white py-3 rounded-md bg-[#de953c] hover:bg-[#cb8126] transition">
                  <Link to={"/all-products"}>Continue Shopping</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
