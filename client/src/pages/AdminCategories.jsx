import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Layers, Search, AlertCircle } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../api/categories';
import { mockCategories } from '../data/mockData';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Confirm Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to mock data:', err.message);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add Click
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  // Handle Edit Click
  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setFormErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Category name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, formData);
      } else {
        await createCategoryApi(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save category';
      setApiError(msg);
      // Fallback local state update if backend offline
      if (!err.response) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((c) =>
              c._id === editingCategory._id ? { ...c, ...formData } : c
            )
          );
        } else {
          setCategories((prev) => [
            ...prev,
            { _id: `cat_${Date.now()}`, ...formData, createdAt: new Date().toISOString() },
          ]);
        }
        setIsModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      await deleteCategoryApi(categoryToDelete._id);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || 'Could not delete category';
      alert(msg);
      // Local fallback
      if (!err.response) {
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout
      title="Categories Management"
      subtitle="Organize product catalog categories and taxonomies"
      actions={
        <Button variant="primary" size="md" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      }
    >
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-2xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
        <div className="text-xs font-semibold text-gray-500 shrink-0">
          Total: {filteredCategories.length}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200/70 p-12 text-center">
          <EmptyState
            icon={Layers}
            title="No Categories Found"
            description="Create your first catalog category to start organizing products."
            actionLabel="Add Category"
            onAction={handleOpenAdd}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200/80">
                <tr>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">
                      {category.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(category);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {apiError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Electronics, Footwear, Fashion"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            error={formErrors.name}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of merchandise belonging to this category..."
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
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? This action cannot be undone and will fail if products still reference it.`}
        confirmText="Delete Category"
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminCategories;
