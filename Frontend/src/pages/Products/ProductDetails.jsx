import React from "react";

const ProductDetailPage = () => {
  // Mock product data
  const product = {
    name: "Premium Wireless Headphones",
    price: 129.99,
    rating: 4.5,
    totalReviews: 128,
    description: `Experience crystal-clear audio with our premium wireless headphones. 
      Featuring active noise cancellation, 30-hour battery life, and memory foam ear cushions 
      for all-day comfort. Bluetooth 5.0 connectivity ensures stable pairing with all your devices. 
      The sleek, foldable design makes them perfect for travel. Includes a premium carrying case, 
      audio cable, and USB-C charging cable. Water-resistant construction protects against sweat 
      and light rain. Voice assistant compatible with Siri and Google Assistant. 
      Available in matte black, silver, and navy blue finishes. 
      Our 2-year warranty guarantees peace of mind.`,
  };

  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">({product.totalReviews})</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white overflow-hidden">
          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Left Side - Product Image */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 md:h-[450px] flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  <p className="text-3xl font-bold text-indigo-600 mr-4">
                    ₹{product.price.toLocaleString()}
                  </p>
                  {renderStars(product.rating)}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Product Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
