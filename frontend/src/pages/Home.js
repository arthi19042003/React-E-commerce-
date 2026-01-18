import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaMoneyBillWave } from 'react-icons/fa';
import './Home.css'; 

const Home = () => {
  // Initialize with empty arrays
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

      // --- CRITICAL FIX START ---
      // We check if .data exists, and if .products exists.
      // If NOT, we fallback to an empty array [] to prevent the crash.
      
      // Handle Products Response
      if (productsRes.data && productsRes.data.products) {
          setFeaturedProducts(productsRes.data.products);
      } else {
          setFeaturedProducts([]); 
      }

      // Handle Categories Response
      if (categoriesRes.data && categoriesRes.data.categories) {
          setCategories(categoriesRes.data.categories);
      } else if (Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
      } else {
          setCategories([]);
      }
      // --- CRITICAL FIX END ---

    } catch (error) {
      console.error('Error loading data:', error);
      // Ensure we don't leave it undefined on error
      setFeaturedProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* Hero Banner */}
      <section className="home-page-hero-banner">
        <div className="home-page-hero-content">
          <div className="home-page-hero-text">
            <h1>Shop Smart, Live Better</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <div className="home-page-hero-buttons">
              <Link to="/products" className="home-page-btn home-page-btn-primary">
                Shop Now
              </Link>
              <Link to="/products?sort=newest" className="home-page-btn home-page-btn-outline">
                New Arrivals
              </Link>
            </div>
          </div>
          <div className="home-page-hero-image">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" alt="Shopping" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="home-page-features-bar">
        <div className="home-page-container">
          <div className="home-page-features-grid">
            <div className="home-page-feature-item">
              <FaShippingFast className="home-page-feature-icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above ₹500</p>
              </div>
            </div>
            <div className="home-page-feature-item">
              <FaMoneyBillWave className="home-page-feature-icon" />
              <div>
                <h4>Easy Returns</h4>
                <p>7 days return policy</p>
              </div>
            </div>
            <div className="home-page-feature-item">
              <FaShieldAlt className="home-page-feature-icon" />
              <div>
                <h4>Secure Payment</h4>
                <p>100% secure transactions</p>
              </div>
            </div>
            <div className="home-page-feature-item">
              <FaHeadset className="home-page-feature-icon" />
              <div>
                <h4>24/7 Support</h4>
                <p>Dedicated support team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-page-categories-section">
        <div className="home-page-container">
          <div className="home-page-section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="home-page-view-all">View All </Link>
          </div>
          <div className="home-page-categories-grid">
            {/* Safe Check: Use ?.length to prevent crash */}
            {categories?.length > 0 ? (
                categories.slice(0, 8).map(category => (
                <Link 
                    key={category._id} 
                    to={`/products?category=${category._id}`}
                    className="home-page-category-card"
                >
                    <div className="home-page-category-icon">
                    {category.name.charAt(0)}
                    </div>
                    <h3>{category.name}</h3>
                </Link>
                ))
            ) : (
                <p>No categories found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-page-featured-section">
        <div className="home-page-container">
          <div className="home-page-section-header">
            <h2>Featured Products</h2>
            <Link to="/products?featured=true" className="home-page-view-all">View All </Link>
          </div>
          {loading ? (
            <div className="home-page-loading">Loading products...</div>
          ) : (
             /* Safe Check: Use ?.length to prevent crash */
             featuredProducts?.length > 0 ? (
                <div className="home-page-products-grid">
                {featuredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
                </div>
            ) : (
                <div className="home-page-no-products">
                <p>No featured products available</p>
                </div>
            )
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="home-page-promo-banner">
        <div className="home-page-container">
          <div className="home-page-promo-content">
            <div className="home-page-promo-text">
              <span className="home-page-promo-badge">SPECIAL OFFER</span>
              <h2>Get 20% Off Your First Order!</h2>
              <p>Sign up today and enjoy exclusive discounts</p>
              <Link to="/register" className="home-page-btn home-page-btn-light">
                Sign Up Now
              </Link>
            </div>
            <div className="home-page-promo-image">
              <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600" alt="Offer" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="home-page-arrivals-section">
        <div className="home-page-container">
          <div className="home-page-section-header">
            <h2>New Arrivals</h2>
            <Link to="/products?sort=newest" className="home-page-view-all">View All </Link>
          </div>
          {/* Safe Check: Use ?.length to prevent crash */}
          {!loading && featuredProducts?.length > 0 && (
            <div className="home-page-products-grid">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="home-page-newsletter-section">
        <div className="home-page-container">
          <div className="home-page-newsletter-content">
            <h2>Stay Updated with Latest Offers</h2>
            <p>Subscribe to our newsletter and never miss out on exclusive deals</p>
            <div className="home-page-newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="home-page-newsletter-input"
              />
              <button className="home-page-newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;