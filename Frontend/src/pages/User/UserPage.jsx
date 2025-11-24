import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AddressPage = () => {
  const { userId, accessToken } = useSelector((state) => state.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (address) => {
    setEditingAddress(address._id);
    setShowAddForm(true);
    setFormData({
      fullName: address.fullName || "",
      phoneNumber: address.phoneNumber || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pinCode: address.pinCode || "",
    });
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        const res = await axios.put(
          `http://localhost:8000/api/v1/user/address/updateAddress/${editingAddress}`,
          formData,
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
          await getAddress();
          setEditingAddress(null);
          setShowAddForm(false);
          setFormData({
            fullName: "",
            phoneNumber: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
          });
        }
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/user/address/createAddress",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setFormData({
            fullName: "",
            phoneNumber: "",
            address: "",
            city: "",
            state: "",
            pinCode: "",
          });
          await getAddress();
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAddress = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/address/getAddress",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getAddress();
    }
  }, [accessToken]);

  const handleRemoveAddress = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/user/address/deleteAddress/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setAddresses(addresses.filter((addr) => addr._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side - Add Address Button */}
        <div className="lg:w-1/3">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => setShowAddForm(true)}
          >
            <div className="text-4xl mb-2">+</div>
            <div className="text-lg font-medium text-gray-600">Add address</div>
          </div>
        </div>

        {/* Right Side - Address List and Form */}
        <div className="lg:w-2/3 space-y-6">
          {/* Add New Address Form */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Add a new address</h2>

              <form onSubmit={handleSubmitAddress}>
                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* Mobile Number */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* Address Line 1 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address, P.O. box, company name, c/o"
                  />
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* State */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* Postal Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pin code
                  </label>
                  <input
                    type="number"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=""
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Addresses */}
          {!showAddForm && (
            <>
              <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  <div className="mb-2">
                    <div className="font-medium">{address.fullName}</div>
                    <div className="text-gray-800">{address.address}</div>
                    <div className="text-gray-800">{address.city}</div>
                    <div className="text-gray-800">{address.state}</div>
                    <div className="text-gray-800">{address.pinCode}</div>
                    <div className="text-gray-800">
                      Phone number: {address.phoneNumber}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex space-x-4 mt-2 text-sm">
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className={`px-2 py-1 rounded ${
                          address.isDefault
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-blue-600"
                        }`}
                      >
                        {address.isDefault ? "Default" : "Set as Default"}
                      </button>
                      <button
                        onClick={() => handleUpdate(address)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(address._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
