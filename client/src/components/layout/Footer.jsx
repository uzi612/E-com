import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 text-sm mt-auto border-t border-slate-800">
      {/* Features Banner */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Free Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                On all eligible orders with instant confirmation.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Cash on Delivery</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Pay safely at your doorstep with 100% peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-purple-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Hassle-Free Returns</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Simple 7-day return window for verified items.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Shop<span className="text-blue-500">Pulse</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your destination for curated technology, modern fashion, and premium footwear. Designed for seamless shopping.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-4">Quick Navigation</h5>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Storefront Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition-colors">
                View Cart
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-white transition-colors">
                Track Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-4">Top Categories</h5>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link
                to="/products?category=Electronics"
                className="hover:text-white transition-colors"
              >
                Electronics & Gadgets
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=Fashion"
                className="hover:text-white transition-colors"
              >
                Clothing & Apparel
              </Link>
            </li>
            <li>
              <Link
                to="/products?category=Shoes"
                className="hover:text-white transition-colors"
              >
                Footwear & Sneakers
              </Link>
            </li>
          </ul>
        </div>

        {/* Security & System Info */}
        <div>
          <h5 className="text-white font-semibold text-sm mb-4">System Architecture</h5>
          <p className="text-xs text-gray-400 leading-relaxed">
            Built with React 18, Vite, Tailwind CSS, Node.js Express, and MongoDB Mongoose. Atomic stock decrement & RBAC protected.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <span>Server status:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 ShopPulse E-Commerce. All rights reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for seamless shopping.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
