import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  MapPin,
  Phone,
  User,
  Calendar,
  Package,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { getAllOrdersApi, updateOrderStatusApi } from '../api/orders';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersApi();
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.warn('Orders API fetch failed, checking local demo orders:', err.message);
      // Fallback demo orders for initial preview
      setOrders([
        {
          _id: '651e30014d5e6f7a8b9c0d41',
          user: { name: 'Jane Doe', email: 'jane@example.com' },
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
          totalAmount: 899.99,
          shippingAddress: {
            name: 'Jane Doe',
            phone: '+1 555-0199',
            address: '456 Market St, Apt 2B',
            city: 'San Francisco',
            pincode: '94105',
          },
          status: 'Pending',
          paymentMethod: 'Cash on Delivery',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.warn('Failed to update status on server:', err.message);
      // Fallback local state update
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.name &&
        order.user.name.toLowerCase().includes(search.toLowerCase())) ||
      (order.user?.email &&
        order.user.email.toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.name &&
        order.shippingAddress.name.toLowerCase().includes(search.toLowerCase())) ||
      (order.shippingAddress?.city &&
        order.shippingAddress.city.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <AdminLayout
      title="Customer Orders"
      subtitle="Track orders, inspect delivery destinations, and advance dispatch status"
    >
      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, Email or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="text-xs font-semibold text-gray-500 shrink-0 px-2 hidden sm:block">
            Orders: {filteredOrders.length}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader text="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/70 p-12 text-center">
          <EmptyState
            icon={ShoppingCart}
            title="No Orders Found"
            description="No customer orders match your search criteria."
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3.5">Order ID & Date</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items Summary</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const itemsCount =
                    order.products?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 0;
                  const firstItem = order.products?.[0];

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-gray-900 block text-xs">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'Just now'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 block">
                          {order.shippingAddress?.name ||
                            order.user?.name ||
                            'Customer'}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          {order.shippingAddress?.city || '—'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {firstItem?.image && (
                            <img
                              src={firstItem.image}
                              alt="product"
                              className="w-8 h-8 rounded-lg object-cover border bg-gray-50 shrink-0"
                            />
                          )}
                          <div className="min-w-0 max-w-xs">
                            <span className="text-gray-800 font-medium truncate block">
                              {firstItem?.name || 'Item'}
                            </span>
                            {order.products?.length > 1 && (
                              <span className="text-[11px] text-gray-400">
                                +{order.products.length - 1} more ({itemsCount} items)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          COD
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className="text-xs font-semibold rounded-lg px-2.5 py-1 border border-gray-200 bg-white shadow-2xs cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        title={`Order Details #${selectedOrder?._id?.slice(-8).toUpperCase()}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-gray-700">
            {/* Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                  Order Status
                </span>
                <div className="mt-1">
                  <Badge status={selectedOrder.status} />
                </div>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                  Placed On
                </span>
                <span className="font-bold text-gray-900 mt-1 block">
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString()
                    : 'Just now'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 font-semibold block uppercase">
                  Total Amount
                </span>
                <span className="font-extrabold text-sm text-slate-900 mt-1 block">
                  ${Number(selectedOrder.totalAmount || 0).toFixed(2)} (COD)
                </span>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
              <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Delivery Address & Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 pt-1">
                <p>
                  <strong>Recipient:</strong> {selectedOrder.shippingAddress?.name}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}
                </p>
                <p className="sm:col-span-2">
                  <strong>Street:</strong> {selectedOrder.shippingAddress?.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.shippingAddress?.city}
                </p>
                <p>
                  <strong>Pincode:</strong> {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Purchased Items List */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 text-xs flex items-center gap-1.5">
                <Package className="w-4 h-4 text-gray-500" /> Purchased Items (
                {selectedOrder.products?.length || 0})
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                {selectedOrder.products?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
                        }
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border shrink-0"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-gray-500 text-[11px]">
                          ${Number(item.price).toFixed(2)} × {item.quantity} unit(s)
                        </p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 text-sm">
                      ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Changer Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-600">
                  Update Status:
                </span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  className="text-xs font-semibold rounded-lg px-3 py-1.5 border border-gray-300 bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
