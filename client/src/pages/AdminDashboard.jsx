import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { getCategoriesApi } from '../api/categories';
import { getProductsApi } from '../api/products';
import { getAllOrdersApi } from '../api/orders';
import { mockCategories, mockProducts } from '../data/mockData';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categoriesCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes, ordRes] = await Promise.allSettled([
          getCategoriesApi(),
          getProductsApi(),
          getAllOrdersApi(),
        ]);

        const categories =
          catRes.status === 'fulfilled' && catRes.value?.data
            ? catRes.value.data
            : mockCategories;

        const products =
          prodRes.status === 'fulfilled' && prodRes.value?.data
            ? prodRes.value.data
            : mockProducts;

        const orders =
          ordRes.status === 'fulfilled' && ordRes.value?.data
            ? ordRes.value.data
            : [];

        const revenue = orders.reduce(
          (sum, ord) => sum + (Number(ord.totalAmount) || 0),
          0
        );

        setStats({
          categoriesCount: categories.length,
          productsCount: products.length,
          ordersCount: orders.length,
          totalRevenue: revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.warn('Dashboard fetch err:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tag: 'From customer orders',
    },
    {
      title: 'Customer Orders',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      tag: 'Total placed orders',
    },
    {
      title: 'Catalog Products',
      value: stats.productsCount,
      icon: Package,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      tag: 'Active listings',
    },
    {
      title: 'Categories',
      value: stats.categoriesCount,
      icon: Layers,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      tag: 'Taxonomy divisions',
    },
  ];

  return (
    <AdminLayout
      title="Overview & Analytics"
      subtitle="Welcome to your Mini E-Commerce management control room"
    >
      {loading ? (
        <Loader text="Loading dashboard metrics..." />
      ) : (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {stat.title}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${stat.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {stat.tag}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Management Gateways */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/admin/categories"
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs hover:border-blue-500 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                Categories Management
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Add, edit, or delete categories with active dependency protections.
              </p>
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                Manage Categories <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/admin/products"
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs hover:border-emerald-500 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 group-hover:text-emerald-600 transition-colors">
                Products Inventory
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Maintain product catalog listings, image previews, pricing, and stock levels.
              </p>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                Manage Products <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              to="/admin/orders"
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs hover:border-purple-500 hover:shadow-lg transition group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 group-hover:text-purple-600 transition-colors">
                Customer Orders
              </h3>
              <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                Review incoming checkout orders, check delivery addresses, and advance dispatch status.
              </p>
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1.5">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Recent Orders Snapshot
                </h3>
                <p className="text-xs text-gray-500">
                  Latest customer purchases received across the platform
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Full Orders Table <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No orders placed yet. Test the storefront checkout flow!
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-mono text-[11px]">
                        #{order._id.slice(-4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {order.shippingAddress?.name ||
                            order.user?.name ||
                            'Customer'}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          {order.products?.length || 1} item(s) •{' '}
                          {order.shippingAddress?.city || 'Delivery'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-gray-900 text-sm">
                        ${Number(order.totalAmount || 0).toFixed(2)}
                      </span>
                      <Badge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
