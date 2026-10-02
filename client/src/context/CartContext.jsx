import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecom_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  // Auto-dismiss notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecom_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
  };

  /**
   * Add a product to the cart with stock limits
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return false;

    const availableStock = typeof product.stock === 'number' ? product.stock : 999;
    if (availableStock <= 0) {
      showNotification(`"${product.name}" is currently out of stock.`, 'error');
      return false;
    }

    let success = true;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > availableStock) {
          showNotification(
            `Cannot add more. Maximum available stock is ${availableStock}.`,
            'warning'
          );
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: availableStock,
          };
          return updated;
        }

        showNotification(`Added ${quantity} more to your cart.`, 'success');
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const finalQty = Math.min(quantity, availableStock);
        if (quantity > availableStock) {
          showNotification(
            `Quantity capped at maximum available stock (${availableStock}).`,
            'warning'
          );
        } else {
          showNotification(`"${product.name}" added to cart!`, 'success');
        }

        return [...prevItems, { product, quantity: finalQty }];
      }
    });

    return success;
  };

  /**
   * Update quantity of a product in the cart
   */
  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product._id === productId);
      if (!existing) return prevItems;

      const availableStock =
        typeof existing.product.stock === 'number' ? existing.product.stock : 999;

      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.product._id !== productId);
      }

      if (newQuantity > availableStock) {
        showNotification(
          `Cannot exceed available stock of ${availableStock}.`,
          'warning'
        );
        return prevItems.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: availableStock }
            : item
        );
      }

      return prevItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  /**
   * Remove product from cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const removed = prevItems.find((i) => i.product._id === productId);
      if (removed) {
        showNotification(`Removed "${removed.product.name}" from cart.`, 'info');
      }
      return prevItems.filter((item) => item.product._id !== productId);
    });
  };

  /**
   * Clear all items from cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  // Computations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        notification,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
