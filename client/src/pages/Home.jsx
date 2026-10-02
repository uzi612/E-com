import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { getProductsApi } from '../api/products';
import { getCategoriesApi } from '../api/categories';
import { initialProducts, initialCategories } from '../data/mockData';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          getProductsApi(),
          getCategoriesApi(),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value?.data?.length > 0) {
          setFeaturedProducts(prodRes.value.data.slice(0, 8));
        } else {
          setFeaturedProducts(initialProducts.slice(0, 8));
        }

        if (catRes.status === 'fulfilled' && catRes.value?.data?.length > 0) {
          setCategories(catRes.value.data);
        } else {
          setCategories(initialCategories);
        }
      } catch (err) {
        console.warn('Backend not ready, rendering mock data:', err);
        setFeaturedProducts(initialProducts.slice(0, 8));
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Next-Gen Shopping Experience
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight lg:leading-tight">
            Curated Tech, Fashion & Lifestyle Essentials.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover precision-crafted gadgets, trending fashion wear, and high-performance footwear with instant doorstep delivery and cash on delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Explore Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/products?category=Electronics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md border border-white/10 transition-all"
            >
              Shop Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Carousel / Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Browse by Department
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            All Categories
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat._id || cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">
                    Department 0{idx + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                    {cat.description || `Browse our latest ${cat.name} collection.`}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Trending Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hand-picked bestsellers ready for instant ordering.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-blue-600 self-start sm:self-auto"
          >
            View all products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* Key Guarantees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Fast & Free Shipping</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy fast dispatch and doorstep tracking on every item in our storefront.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">100% Genuine Items</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Directly sourced authentic goods with complete quality assurance guarantees.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Cash on Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect your items before you pay. Completely transparent zero-risk shopping.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
