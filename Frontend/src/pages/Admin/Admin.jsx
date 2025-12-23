import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import AllOrders from "./AllOrders";

const Admin = () => {
  const { accessToken } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("all-orders");
  const [products, setProducts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    totalStock: "",
    averageReview: "",
    image: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  // Open Edit Modal
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
      image: null,
    });
    setIsModalOpen(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:8000/api/v1/admin/product/updateProduct/${editingProduct._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/v1/admin/product/createProduct",
          data,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }
      getAllProducts();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  // get all products
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
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, []);

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

  const fields = [
    { label: "Title", name: "title" },
    { label: "Description", name: "description" },
    { label: "Category", name: "category" },
    { label: "Brand", name: "brand" },
    { label: "Price", name: "price", type: "number" },
    { label: "Total Stock", name: "totalStock", type: "number" },
    { label: "Average Review", name: "averageReview", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Tabs */}
      <div className="mb-6 border-b">
        <nav className="flex gap-6">
          {["all-orders", "all-products", "dashboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 font-medium ${
                activeTab === tab
                  ? "text-[#FA812F] border-b-2 border-[#FA812F]"
                  : "text-gray-500"
              }`}
            >
              {tab.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Orders */}
      {activeTab === "all-orders" && <AllOrders />}

      {/* Products */}
      {activeTab === "all-products" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={openCreateModal}
              className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
            >
              + Create Product
            </button>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg"
              >
                <img
                  src={product.image[0]?.url}
                  alt={product.title}
                  className="h-40 w-full object-contain"
                />
                <h3 className="font-semibold mt-3">{product.title}</h3>
                <p className="text-gray-600 text-sm">
                  {product.category} • {product.brand}
                </p>
                <p className="text-[#FA812F] font-bold text-lg">
                  ₹{product.price.toLocaleString()}
                </p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 bg-purple-600 text-white py-1.5 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-lg p-6  max-h-[90vh] overflow-y-auto ">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Create Product"}
            </h2>

            {/* Image Input */}
            <div className="border-2 border-dashed rounded-lg p-4 text-center mb-4">
              <p className="text-gray-500">Upload product image</p>

              <input
                type="file"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
                className="mt-2"
              />
            </div>

            {/* Inputs */}
            {fields.map((field) => (
              <div key={field.name} className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#FA812F] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
