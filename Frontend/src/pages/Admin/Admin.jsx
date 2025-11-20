import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Admin = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("all-products");
  const [products, setProducts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    totalStock: "",
    averageReview: "",
    image: null,
  });

  const fileInputRef = useRef(null);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price.toString(),
      totalStock: product.totalStock.toString(),
      averageReview: product.averageReview.toString(),
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    // Save logic (e.g., API call)
    console.log("Updated product:", { ...editingProduct, ...formData });
    closeModal();
  };

  // get all products
  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/admin/product/getAllProduct",
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
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, [accessToken]);

  // delete product
  const handleDelete = async (id) => {
    console.log(accessToken);

    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/admin/product/deleteProduct/${id}`,
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
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {["all-orders", "all-products", "dashboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 font-medium text-sm ${
                activeTab === tab
                  ? "text-[#FA812F] border-b-2 border-[#FA812F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "all-products" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-40 flex items-center justify-center bg-gray-50 p-4">
                <img
                  src={product.image[0].url}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-xs mb-2">
                  {product.category} • {product.brand}
                </p>
                <p className="text-[#FA812F] font-bold mb-3">
                  ₹{product.price.toLocaleString()}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 bg-[#92487A] hover:bg-[#75325f] text-white py-1.5 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
          {activeTab === "all-orders"
            ? "All Orders Content"
            : "Dashboard Content"}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>

              <div className="space-y-4">
                {/* Image Dropzone */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
                  onDrop={handleImageDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={handleImageUploadClick}
                >
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mx-auto h-32 object-contain"
                    />
                  ) : (
                    <p className="text-gray-500">
                      Drag & drop an image here or click to upload
                    </p>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                </div>

                {/* Form Fields */}
                {[
                  { label: "Title", name: "title" },
                  { label: "Description", name: "description" },
                  { label: "Category", name: "category" },
                  { label: "Brand", name: "brand" },
                  { label: "Price ($)", name: "price", type: "number" },
                  { label: "Total Stock", name: "totalStock", type: "number" },
                  {
                    label: "Average Review",
                    name: "averageReview",
                    type: "number",
                    step: "0.1",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      step={field.step}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA812F]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#FA812F] text-white rounded-md hover:bg-[#e8721f] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
