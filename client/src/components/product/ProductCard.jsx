import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Badge from '../common/Badge';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();

  if (!product) return null;

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category || 'General';

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const isOutOfStock = stock <= 0;

  // Check how many of this item is already in cart
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isAtMaxStock = inCartQty >= stock && stock > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-300">
      {/* Product Image Container */}
      <Link
        to={`/products/${product._id}`}
        className="relative aspect-square w-full overflow-hidden bg-gray-50 block"
      >
        <img
          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
          }}
        />

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs border border-white/50">
            {categoryName}
          </span>
        </div>

        {/* Stock Badge Over Image */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <Badge variant="danger" size="xs">
              Out of Stock
            </Badge>
          ) : stock <= 5 ? (
            <Badge variant="warning" size="xs">
              Only {stock} left
            </Badge>
          ) : (
            <Badge variant="success" size="xs">
              In Stock
            </Badge>
          )}
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link
          to={`/products/${product._id}`}
          className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5"
          title={product.name}
        >
          {product.name}
        </Link>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description || 'No description provided.'}
        </p>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">
              ${Number(product.price || 0).toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAtMaxStock}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAtMaxStock
                ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                : inCartQty > 0
                ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-xs'
            }`}
            title={
              isOutOfStock
                ? 'Out of stock'
                : isAtMaxStock
                ? `Max quantity (${stock}) already in cart`
                : 'Add to Cart'
            }
          >
            {inCartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{inCartQty} in cart</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
