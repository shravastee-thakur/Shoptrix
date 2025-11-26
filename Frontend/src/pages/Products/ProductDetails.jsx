import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartState } from "../../redux/CartSlice";
import toast from "react-hot-toast";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    { id: 1, text: "Amazing quality and fast delivery!", rating: 5 },
    { id: 2, text: "Good product but slightly overpriced.", rating: 4 },
  ]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      const newReview = {
        id: reviews.length + 1,
        text: reviewText,
        rating: 5, // In a real app, you'd capture actual rating
      };
      setReviews([newReview, ...reviews]);
      setReviewText("");
      setShowReviewForm(false);
    }
  };

  const productDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/getProductById/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        setProduct(res.data.product);
      }
    } catch (error) {
      console.error("Failed to fetch product", error);
    }
  };

  const getAllProducts = async () => {
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
        setAllProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    productDetails();
    getAllProducts();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length === 0) return [];

    return allProducts
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 2);
  }, [product, allProducts]);

  const handleAddToCart = async (product) => {
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
        { productId: product._id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(addToCartState({ productId: product._id, quantity: 1 }));
      }

      console.log("Added to cart:", product.title);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/wishlist/addToWishlist",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
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
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Product Section */}
      <div className="bg-white flex flex-col md:flex-row gap-8">
        {/* Left Column - Product Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="rounded-xl w-full h-96 md:h-[500px] flex items-center justify-center">
            <img src={product.image[0]?.url} alt={product.title} />
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <p className="text-3xl font-bold text-gray-900 mb-6">
            ₹{product.price.toLocaleString()}
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAddToCart(product)}
              className="bg-[#D34E4E] hover:bg-[#cf3f3f] text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full sm:w-auto"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleAddToWishlist(product)}
              className="bg-[#de953c] hover:bg-[#cb8126] text-white font-medium py-3 px-8 rounded-lg transition duration-300 w-full sm:w-auto"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>

        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">No related products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-auto flex items-center justify-center pt-2">
                  <Link to={`/product-detail/${product._id}`}>
                    <img
                      className="h-[150px] w-auto"
                      src={product.image[0]?.url}
                      alt={product.title}
                    />
                  </Link>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-blue-600 font-bold">
                    ₹{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
