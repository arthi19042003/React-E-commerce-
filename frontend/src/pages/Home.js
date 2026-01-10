import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/api';
import './Home.css';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []); // Initial load

  // Re-load products whenever category changes
  useEffect(() => {
    loadProducts();
  }, [selectedCategory]); 

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error loading categories", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Send search and category to backend
      const { data } = await getProducts({ 
        search: searchTerm, 
        category: selectedCategory 
      });
      setProducts(data.products);
    } catch (error) {
      console.error("Error loading products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(); // Trigger search on form submit
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    // We need to manually trigger load because setSearchTerm is async
    // simpler way: just reload page or use effect dependency carefully
    window.location.reload(); 
  };

  return (
    <div className="home-page">
      
      {/* --- Hero & Search Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Product</h1>
          <p>Search through our vast collection of electronics and more.</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar-container">
            <input 
              type="text" 
              placeholder="Search products (e.g., iPhone)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* --- Category Filter Section --- */}
      <section className="category-section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          {(selectedCategory || searchTerm) && (
            <button onClick={clearFilters} className="clear-btn">
              <FaTimes /> Clear Filters
            </button>
          )}
        </div>

        <div className="category-list">
          <button 
            className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat._id} 
              className={`category-chip ${selectedCategory === cat._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* --- Product Grid --- */}
      <section className="products-container container">
        <h2 className="section-title">
          {searchTerm ? `Results for "${searchTerm}"` : 'Latest Products'}
        </h2>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try changing your search or category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;