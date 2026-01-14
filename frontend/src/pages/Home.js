import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaMoneyBillWave } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getFeaturedProducts(),
        getCategories()
      ]);
      setFeaturedProducts(productsRes.data.products);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Shop Smart, Live Better</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Now
              </Link>
              <Link to="/products?sort=newest" className="btn btn-outline btn-lg">
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="features-bar">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <FaShippingFast className="feature-icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above ₹500</p>
              </div>
            </div>
            <div className="feature-item">
              <FaMoneyBillWave className="feature-icon" />
              <div>
                <h4>Easy Returns</h4>
                <p>7 days return policy</p>
              </div>
            </div>
            <div className="feature-item">
              <FaShieldAlt className="feature-icon" />
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure transactions</p>
              </div>
            </div>
            <div className="feature-item">
              <FaHeadset className="feature-icon" />
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          <div className="categories-grid">
            {categories.slice(0, 8).map(category => (
              <Link 
                key={category._id} 
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category.name.charAt(0)}
                </div>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products?featured=true" className="view-all-link">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <div className="promo-text">
              <span className="promo-badge">SPECIAL OFFER</span>
              <h2>Get 20% Off Your First Order!</h2>
              <p>Sign up today and enjoy exclusive discounts</p>
              <Link to="/register" className="btn btn-light btn-lg">
                Sign Up Now
              </Link>
            </div>
            <div className="promo-image">
              <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600" alt="Offer" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <Link to="/products?sort=newest" className="view-all-link">View All →</Link>
          </div>
          {!loading && featuredProducts.length > 0 && (
            <div className="products-grid">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated with Latest Offers</h2>
            <p>Subscribe to our newsletter and never miss out on exclusive deals</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;