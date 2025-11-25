import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/order/getOrder",
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
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      getOrders();
    }
  }, [accessToken]);

  return (
    <div className="flex-1 max-w-3xl mx-auto mt-4">
      <div className="space-y-6">
        {orders.map((order) =>
          order.cartItems.map((item) => (
            <div
              key={item._id}
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

                <p className="mt-2">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col justify-between items-end">
                <p className="font-semibold text-lg mt-4">
                  ₹{(item.productId.price * item.quantity).toLocaleString()}
                </p>

                <p className="text-blue-700 font-semibold">
                  {order.orderStatus}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
