import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { getProductByIdApi } from '../api/products';
import { initialProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductByIdApi(id);
        if (response && response.success && response.data) {
          setProduct(response.data);
        } else {
          // Fallback to local mock data
          const found = initialProducts.find((p) => p._id === id);
          setProduct(found || initialProducts[0]);
        }
      } catch (err) {
        console.warn('API error fetching product, using local fallback:', err);
        const found = initialProducts.find((p) => p._id === id);
        setProduct(found || initialProducts[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <Loader fullScreen message="Loading product details..." />;
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500">
          The requested product could not be located in our catalog.
        </p>
        <Link to="/products">
          <Button variant="primary">Return to Storefront</Button>
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category || 'General';

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const isOutOfStock = stock <= 0;

  // Check how many are currently in cart
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = Math.max(0, stock - inCartQty);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > remainingStock) return remainingStock > 0 ? remainingStock : 1;
      return next;
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, quantity);
    if (success !== false) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Product Showcase Gallery */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';
              }}
            />
            {/* Pill over image */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs border border-white/60">
                {categoryName}
              </span>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {categoryName}
              </span>
              <span className="text-gray-300">•</span>
              {isOutOfStock ? (
                <Badge variant="danger" size="xs">
                  Out of Stock
                </Badge>
              ) : stock <= 5 ? (
                <Badge variant="warning" size="xs">
                  Low Stock: Only {stock} units left
                </Badge>
              ) : (
                <Badge variant="success" size="xs">
                  In Stock ({stock} available)
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-slate-900">
                ${Number(product.price || 0).toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                Taxes included • Free delivery eligible
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-100 py-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description ||
                'Experience top-tier quality and design built to exceed expectations.'}
            </p>
          </div>

          {/* In-Cart Status Reminder */}
          {inCartQty > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-800">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                You already have <strong className="font-semibold">{inCartQty}</strong> of this in your cart.
              </span>
              <Link to="/cart" className="font-bold underline hover:text-blue-900">
                View Cart
              </Link>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={remainingStock <= quantity}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {remainingStock < stock && (
                  <span className="text-xs text-gray-400">
                    ({remainingStock} more can be added)
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant={added ? 'accent' : 'primary'}
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock || remainingStock <= 0}
                className="flex-1 text-sm font-semibold"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 mr-1" /> Added to Cart!
                  </>
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : remainingStock <= 0 ? (
                  'Max Stock in Cart'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-1" /> Add to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 text-sm font-semibold border-slate-900 text-slate-900 hover:bg-slate-50"
              >
                Buy Now (COD)
              </Button>
            </div>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Standard delivery 2-4 days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cash on delivery eligible</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-purple-600 shrink-0" />
              <span>7-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
