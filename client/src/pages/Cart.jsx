import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

const Cart = () => {
  const {
    cartItems,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Looks like you haven't added anything to your cart yet. Discover high-quality products across our catalog!
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" className="px-8 font-semibold">
            Start Shopping Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{totalItems}</strong> {totalItems === 1 ? 'item' : 'items'} in your bag.
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline self-start sm:self-auto flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden shadow-xs">
            {cartItems.map((item) => {
              const { product, quantity } = item;
              const stock = typeof product.stock === 'number' ? product.stock : 999;
              const isMaxStock = quantity >= stock;

              return (
                <div
                  key={product._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link
                      to={`/products/${product._id}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 block"
                    >
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300';
                        }}
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                        {typeof product.category === 'object'
                          ? product.category?.name
                          : product.category || 'Product'}
                      </span>
                      <Link
                        to={`/products/${product._id}`}
                        className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${Number(product.price || 0).toFixed(2)} each
                      </p>
                      {stock <= 5 && (
                        <p className="text-[11px] text-amber-600 font-medium mt-1">
                          Only {stock} available in inventory
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, quantity - 1)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs sm:text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product._id, quantity + 1)}
                        disabled={isMaxStock}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                        title={isMaxStock ? 'Maximum stock reached' : 'Increase quantity'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div className="text-right min-w-[80px]">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        ${(Number(product.price || 0) * quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(product._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove product from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>

            <div className="flex justify-between">
              <span>Payment Processing</span>
              <span className="font-semibold text-emerald-600">Cash on Delivery</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-gray-900">Grand Total</span>
              <span className="text-2xl font-extrabold text-slate-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full text-sm font-semibold py-3.5 shadow-md"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Value Props */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Free doorstep delivery within 2-4 days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verify products upon receipt before payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
