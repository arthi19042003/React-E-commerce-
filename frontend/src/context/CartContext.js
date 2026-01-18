import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // <--- USE THIS IMPORT, NOT AXIOS
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      // This now uses the correct baseURL (port 5000) and token
      const { data } = await api.get('/cart'); 
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data.cart);
      alert('Added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to cart');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data.cart);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};