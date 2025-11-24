import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

const SearchProducts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [products, setProducts] = useState([]);

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/product/search?q=${query}`
      );
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    // <div className="max-w-7xl min-h-screen mx-auto px-4 py-6">
    //   <h2 className="text-xl font-semibold mb-4">
    //     Search results for: <span className="text-purple-600">{query}</span>
    //   </h2>

    //   {products.length === 0 ? (
    //     <p>No products found.</p>
    //   ) : (
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
    //       {products.map((product) => (
    //         <div
    //           key={product._id}
    //           className="bg-white rounded-lg shadow-md overflow-hidden hover:border border-fuchsia-300 transition-shadow p-4"
    //         >
    //           <Link to={`/product-detail/${product._id}`}>
    //             <img
    //               src={product.image?.[0]?.url}
    //               alt={product.title}
    //               className="max-h-full max-w-full object-contain cursor-pointer"
    //             />
    //           </Link>

    //           <h3 className="font-semibold mt-2 text-sm">{product.title}</h3>
    //           <p className="text-gray-600 text-xs">{product.brand}</p>

    //           <p className="text-purple-600 font-bold mt-2">₹{product.price}</p>
    //           <button
    //               onClick={() => handleAddToCart(product)}
    //               className="mt-2 w-full bg-[#D34E4E] hover:bg-[#cf3f3f] text-white py-1.5 rounded text-sm transition-colors"
    //             >
    //               Add to Cart
    //             </button>
    //         </div>

    //       ))}
    //     </div>
    //   )}
    // </div>
    <div className="min-h-screen pt-4 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Search results for: <span className="text-purple-600">{query}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
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
      </div>
    </div>
  );
};

export default SearchProducts;
