import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Badge from '../components/common/Badge';

const MyOrders = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and review your past orders and shipments.
          </p>
        </div>
      </div>

      {/* Demo sample order card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Order ID
            </span>
            <p className="text-sm font-bold text-gray-900 font-mono">#ORD-651e30014d5e</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Placed On
            </span>
            <p className="text-sm font-medium text-gray-700">October 2, 2026</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Total Amount
            </span>
            <p className="text-sm font-extrabold text-slate-900">$899.99 (COD)</p>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
              Status
            </span>
            <Badge variant="warning">Pending Dispatch</Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200"
            alt="Product"
            className="w-16 h-16 rounded-xl object-cover border"
          />
          <div>
            <h4 className="font-semibold text-sm text-gray-900">Smart Phone Pro X</h4>
            <p className="text-xs text-gray-500">Qty: 1 • $899.99</p>
            <p className="text-xs text-gray-400 mt-1">Delivering to 456 Market St, Apt 2B, San Francisco</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
