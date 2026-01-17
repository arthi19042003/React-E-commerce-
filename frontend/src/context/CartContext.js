import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  // Load cart
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/cart');
      setCart(res.data.cart);
    } catch (error) {
      console.error('Load cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return { success: false };
    }

    try {
      const res = await axios.post('/api/cart/add', { productId, quantity });
      setCart(res.data.cart);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      console.error(message);
      return { success: false, message };
    }
  };

  // Update cart item
  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await axios.put(`/api/cart/update/${itemId}`, { quantity });
      setCart(res.data.cart);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      console.error(message);
      return { success: false, message };
    }
  };

  // Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${itemId}`);
      setCart(res.data.cart);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      console.error(message);
      return { success: false, message };
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const res = await axios.delete('/api/cart/clear');
      setCart(res.data.cart);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      console.error(message);
      return { success: false, message };
    }
  };

  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        cartTotal,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};