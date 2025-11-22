import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCartState } from "../../redux/CartSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const [products, setProducts] = useState([]);

  const allCategories = ["all", ...new Set(products.map((p) => p.category))];

  const [filters, setFilters] = useState({
    category: "all",
    priceSort: "low-to-high",
  });

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    // Sort by price
    result.sort((a, b) =>
      filters.priceSort === "low-to-high"
        ? a.price - b.price
        : b.price - a.price
    );

    return result;
  }, [filters, products]);

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handlePriceSortChange = (e) => {
    setFilters((prev) => ({ ...prev, priceSort: e.target.value }));
  };

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
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleAddToCart = async (product) => {
    dispatch(addToCartState({ productId: product._id, quantity: 1 }));

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/cart/addToCart",
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Added to cart:", product.title);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
          Shop Products
        </h1>

        {/* Filter Controls - Top Right */}
        <div className="flex justify-end gap-3 mb-6 ">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          <select
            value={filters.priceSort}
            onChange={handlePriceSortChange}
            className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
          >
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:border border-fuchsia-300 transition-shadow"
            >
              {/* Clickable Image - Links to Product Detail */}
              <Link
                to={`/product-detail/${product._id}`}
                className="h-40 flex items-center justify-center p-4"
              >
                <img
                  src={product.image[0]?.url}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain cursor-pointer"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {product.title}
                </h3>
                <p className="text-blue-600 font-bold">
                  ₹{product.price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 w-full bg-[#D34E4E] hover:bg-[#cf3f3f] text-white py-1.5 rounded text-sm transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600 mt-6">
            No products match your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
