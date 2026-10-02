import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { getMyOrdersApi } from '../api/orders';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getMyOrdersApi();
        if (res && res.data) {
          setOrders(res.data);
        }
      } catch (err) {
        console.warn('Orders fetch error:', err.message);
        // Fallback demo order
        setOrders([
          {
            _id: '651e30014d5e6f7a8b9c0d41',
            createdAt: new Date().toISOString(),
            totalAmount: 899.99,
            status: 'Pending',
            paymentMethod: 'Cash on Delivery',
            shippingAddress: {
              name: 'Jane Doe',
              phone: '+1 555-0199',
              address: '456 Market St, Apt 2B',
              city: 'San Francisco',
              pincode: '94105',
            },
            products: [
              {
                product: '651d20014d5e6f7a8b9c0d31',
                name: 'Smart Phone Pro X',
                price: 899.99,
                quantity: 1,
                image:
                  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200',
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="border-b border-gray-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review status, past receipts, and delivery tracking of your purchases.
          </p>
        </div>

        <Link to="/products">
          <Button variant="secondary" size="sm">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader text="Fetching your order history..." />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center">
          <EmptyState
            icon={ShoppingBag}
            title="No Past Orders"
            description="You haven't placed any orders yet. Browse our catalog and enjoy seamless checkout."
            actionLabel="Start Shopping"
            actionLink="/products"
          />
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-slate-50/80 p-5 sm:px-6 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                        Order ID
                      </span>
                      <span className="font-mono font-black text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className="hidden sm:block border-l border-gray-300 h-6" />

                    <div className="hidden sm:block">
                      <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                        Date Placed
                      </span>
                      <span className="font-bold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                        Total Amount
                      </span>
                      <span className="font-black text-slate-900 text-sm">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="border-l border-gray-300 h-6" />

                    <div>
                      <span className="text-[11px] text-gray-400 font-semibold block uppercase mb-0.5">
                        Status
                      </span>
                      <Badge status={order.status} />
                    </div>
                  </div>
                </div>

                {/* Purchased Items Snapshot */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="divide-y divide-gray-100">
                    {order.products?.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
                            }
                            alt={item.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-gray-200 bg-gray-50 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Quantity: <strong>{item.quantity}</strong> • Unit Price: $
                              {Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="font-black text-slate-900 text-sm shrink-0">
                          ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping info footer */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        Delivering to{' '}
                        <strong>{order.shippingAddress?.name}</strong>,{' '}
                        {order.shippingAddress?.address},{' '}
                        {order.shippingAddress?.city} (
                        {order.shippingAddress?.pincode})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                      <span>Payment: Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
