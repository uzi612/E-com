import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Search,
  AlertCircle,
  Image as ImageIcon,
  AlertTriangle,
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '../api/products';
import { getCategoriesApi } from '../api/categories';
import { mockProducts, mockCategories } from '../data/mockData';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    category: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProductsApi(),
        getCategoriesApi(),
      ]);

      if (prodRes && prodRes.data) setProducts(prodRes.data);
      if (catRes && catRes.data) setCategories(catRes.data);
    } catch (err) {
      console.warn('API fetch failed, falling back to mock data:', err.message);
      setProducts(mockProducts);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '10',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      category: categories.length > 0 ? categories[0]._id : '',
    });
    setFormErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock !== undefined ? product.stock.toString() : '0',
      image: product.image || '',
      category:
        typeof product.category === 'object'
          ? product.category?._id
          : product.category || (categories[0]?._id || ''),
    });
    setFormErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || Number(formData.price) <= 0)
      errors.price = 'Valid price greater than 0 is required';
    if (formData.stock === '' || Number(formData.stock) < 0)
      errors.stock = 'Stock must be 0 or greater';
    if (!formData.image.trim()) errors.image = 'Product image URL is required';
    if (!formData.category) errors.category = 'Please select a category';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image.trim(),
      category: formData.category,
    };

    try {
      if (editingProduct) {
        await updateProductApi(editingProduct._id, payload);
      } else {
        await createProductApi(payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product';
      setApiError(msg);
      // Fallback local state update
      if (!err.response) {
        const catObj = categories.find((c) => c._id === formData.category);
        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) =>
              p._id === editingProduct._id
                ? { ...p, ...payload, category: catObj || payload.category }
                : p
            )
          );
        } else {
          setProducts((prev) => [
            {
              _id: `prod_${Date.now()}`,
              ...payload,
              category: catObj || payload.category,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
        setIsModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProductApi(productToDelete._id);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchData();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Could not delete product';
      alert(msg);
      if (!err.response) {
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      (prod.description && prod.description.toLowerCase().includes(search.toLowerCase()));

    const categoryId =
      typeof prod.category === 'object' ? prod.category?._id : prod.category;
    const categoryName =
      typeof prod.category === 'object' ? prod.category?.name : '';

    const matchesCategory =
      selectedCategory === 'All' ||
      categoryId === selectedCategory ||
      categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout
      title="Products Inventory"
      subtitle="Manage inventory catalog, pricing, and stock levels"
      actions={
        <Button variant="primary" size="md" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Product
        </Button>
      }
    >
      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="text-xs font-semibold text-gray-500 shrink-0 px-2 hidden sm:block">
            Count: {filteredProducts.length}
          </div>
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <Loader text="Loading inventory..." />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/70 p-12 text-center">
          <EmptyState
            icon={Package}
            title="No Products Found"
            description="Add listings to your inventory or adjust search filters."
            actionLabel="Add Product"
            onAction={handleOpenAdd}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3.5">Product</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5">Stock Level</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const categoryName =
                    typeof product.category === 'object'
                      ? product.category?.name
                      : categories.find((c) => c._id === product.category)?.name ||
                        'Unassigned';
                  const isLowStock = product.stock <= 5;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 truncate text-sm">
                              {product.name}
                            </p>
                            <p className="text-gray-400 text-[11px] truncate">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant="primary">{categoryName}</Badge>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold ${
                              product.stock === 0
                                ? 'text-rose-600'
                                : isLowStock
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }`}
                          >
                            {product.stock} units
                          </span>
                          {isLowStock && product.stock > 0 && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low
                            </span>
                          )}
                          {product.stock === 0 && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full font-bold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product Listing' : 'Add New Product'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {apiError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <Input
            label="Product Title"
            placeholder="e.g. Wireless Noise Cancelling Headphones"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition ${
                  formErrors.category ? 'border-rose-300' : 'border-gray-200'
                }`}
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {formErrors.category}
                </p>
              )}
            </div>

            <Input
              label="Price ($ USD)"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="199.99"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              error={formErrors.price}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              min="0"
              placeholder="25"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, stock: e.target.value }))
              }
              error={formErrors.stock}
              required
            />

            <Input
              label="Image URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              error={formErrors.image}
              required
            />
          </div>

          {/* Live Image Preview */}
          {formData.image && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200/80 text-xs">
              <img
                src={formData.image}
                alt="Preview"
                className="w-14 h-14 rounded-xl object-cover border bg-white shrink-0"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200';
                }}
              />
              <div className="min-w-0">
                <span className="font-bold text-gray-700 block">
                  Live Thumbnail Preview
                </span>
                <span className="text-[11px] text-gray-400 truncate block">
                  {formData.image}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed specifications and key selling points..."
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none ${
                formErrors.description ? 'border-rose-300' : 'border-gray-200'
              }`}
              required
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {editingProduct ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This will permanently remove the item from the catalog.`}
        confirmText="Delete Product"
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminProducts;
