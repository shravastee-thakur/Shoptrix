import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Trending = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/product/getAllProduct",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        setTrendingProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="pt-4 pb-8 px-4 py-4 bg-red-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          Trending Products
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Product Section */}
          <div className="flex-1">
            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {trendingProducts.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product-detail/${product._id}`}>
                    <div className="h-40 flex items-center justify-center bg-gray-50 p-4">
                      <img
                        src={product.image[0]?.url}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      {product.title}
                    </h3>
                    <p className="text-[#FA812F] font-bold">
                      ₹{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
