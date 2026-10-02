import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Package, Layers, ShoppingCart } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Storefront
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Platform control center for Categories, Products & Orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <Layers className="w-6 h-6 text-blue-600 mb-2" />
          <h3 className="font-bold text-gray-900">Categories Management</h3>
          <p className="text-xs text-gray-500">
            Create, update, and manage product catalog taxonomy and categories.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <Package className="w-6 h-6 text-emerald-600 mb-2" />
          <h3 className="font-bold text-gray-900">Products Inventory</h3>
          <p className="text-xs text-gray-500">
            Add new listings, update prices, adjust stock levels, and upload images.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <ShoppingCart className="w-6 h-6 text-purple-600 mb-2" />
          <h3 className="font-bold text-gray-900">Customer Orders</h3>
          <p className="text-xs text-gray-500">
            Review incoming orders, inspect shipping details, and update status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
