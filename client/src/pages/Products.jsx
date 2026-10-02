import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import CategoryFilter from '../components/product/CategoryFilter';
import { getProductsApi } from '../api/products';
import { getCategoriesApi } from '../api/categories';
import { initialProducts, initialCategories } from '../data/mockData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const searchTerm = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          getProductsApi(),
          getCategoriesApi(),
        ]);

        if (prodRes.status === 'fulfilled' && prodRes.value?.data?.length > 0) {
          setProducts(prodRes.value.data);
        } else {
          setProducts(initialProducts);
        }

        if (catRes.status === 'fulfilled' && catRes.value?.data?.length > 0) {
          setCategories(catRes.value.data);
        } else {
          setCategories(initialCategories);
        }
      } catch (err) {
        console.warn('Using mock products data:', err);
        setProducts(initialProducts);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryChange = (categoryName) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      params.delete('category');
    } else {
      params.set('category', categoryName);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  // Filter and sort products client-side for ultra-fast responsive feel
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory && selectedCategory !== 'All') {
          const catName =
            typeof product.category === 'object'
              ? product.category?.name
              : product.category;
          if (catName?.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Search query filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = product.name?.toLowerCase().includes(term);
          const matchDesc = product.description?.toLowerCase().includes(term);
          if (!matchName && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'price-high') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        return 0; // featured/default
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Products Catalog
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse our full selection of high-quality gear, clothing, and footwear.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search within catalog..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                const params = new URLSearchParams(searchParams);
                params.delete('search');
                setSearchParams(params);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips & Sorting Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Chips */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-xs"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Active Filter summary */}
      {(selectedCategory !== 'All' || searchTerm.trim()) && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-gray-400">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
              Category: {selectedCategory}
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className="hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchTerm.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-medium">
              Query: "{searchTerm}"
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('search');
                  setSearchParams(params);
                }}
                className="hover:text-slate-950"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-rose-600 hover:underline font-medium ml-2"
          >
            Reset all
          </button>
        </div>
      )}

      {/* Products Result Count */}
      <div className="text-xs text-gray-500 font-medium">
        Showing{' '}
        <span className="font-bold text-gray-900">
          {filteredProducts.length}
        </span>{' '}
        {filteredProducts.length === 1 ? 'product' : 'products'}
      </div>

      {/* Grid */}
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        emptyTitle="No products match your criteria"
        emptyDescription="We couldn't find any products matching your search or category selection. Try clearing your filters."
        onResetFilters={handleClearFilters}
      />
    </div>
  );
};

export default Products;
