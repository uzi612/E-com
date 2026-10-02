import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      clearCart();
    }, 800);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Thank you for your order, <strong>{shippingAddress.name}</strong>. Your items will be delivered with Cash on Delivery payment upon arrival.
        </p>
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left max-w-md mx-auto space-y-2 text-xs">
          <p><strong>Shipping to:</strong> {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.pincode}</p>
          <p><strong>Contact:</strong> {shippingAddress.phone}</p>
          <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
          <p><strong>Amount to Pay:</strong> ${totalPrice.toFixed(2)}</p>
        </div>
        <div className="pt-4 flex justify-center gap-4">
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-sm text-gray-500">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Shipping Information</h2>

          <Input
            label="Full Name"
            name="name"
            value={shippingAddress.name}
            onChange={handleChange}
            required
            placeholder="Jane Doe"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={shippingAddress.phone}
            onChange={handleChange}
            required
            placeholder="+1 555-0199"
          />

          <Input
            label="Delivery Address"
            name="address"
            value={shippingAddress.address}
            onChange={handleChange}
            required
            placeholder="456 Market St, Apt 2B"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              required
              placeholder="San Francisco"
            />
            <Input
              label="Pincode / Postal Code"
              name="pincode"
              value={shippingAddress.pincode}
              onChange={handleChange}
              required
              placeholder="94105"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Payment mode is set to <strong>Cash on Delivery (COD)</strong></span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-4"
          >
            Confirm & Place Order (${totalPrice.toFixed(2)})
          </Button>
        </form>

        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4 h-fit">
          <h2 className="text-lg font-bold text-gray-900">Items Summary</h2>
          <div className="divide-y divide-gray-200/60 max-h-80 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.product._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t">
              <span>Total Due on Delivery</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
