// UserPage.js
import React, { useState } from "react";
import AddressPage from "./AddressPage"; //
import MyOrders from "./MyOrders";
import WishlistPage from "./Wishlist";

const UserDetail = () => {
  const [activeTab, setActiveTab] = useState("addresses");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex border-b border-gray-200">
            {[
              { id: "addresses", label: "My Addresses" },
              { id: "orders", label: "My Orders" },
              { id: "wishlist", label: "My Wishlist" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "addresses" && <AddressPage />}

          {activeTab === "orders" && <MyOrders />}

          {activeTab === "wishlist" && <WishlistPage />}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
