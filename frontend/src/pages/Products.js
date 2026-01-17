import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH PRODUCTS */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
      setFilteredProducts(data.products);

      // extract categories from products
      const uniqueCategories = [
        ...new Set(data.products.map(p => p.category?.name).filter(Boolean))
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* READ SEARCH & CATEGORY FROM URL */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // 1. Read Search
    const stateSearch = location.state?.search || '';
    const querySearch = params.get('search') || '';
    setSearch(stateSearch || querySearch);

    // 2. Read Category (The Fix!)
    const queryCategory = params.get('category') || '';
    if (queryCategory) {
      setCategory(queryCategory);
    }
  }, [location]);

  /* FILTER + SORT */
  useEffect(() => {
    let data = [...products];

    // Filter by Search
    if (search) {
      data = data.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by Category (Updated logic)
    if (category) {
      data = data.filter(p => 
        // Match Name (from Dropdown) OR Match ID (from URL)
        p.category?.name === category || 
        p.category?._id === category
      );
    }

    // Sort
    if (sort === 'price-low') {
      data.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-high') {
      data.sort((a, b) => b.price - a.price);
    }
    if (sort === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(data);
  }, [search, category, sort, products]);

  if (loading) return <div className="products-page-loading">Loading products...</div>;

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">All Products</h1>

      {/* SEARCH + SORT + FILTER BAR */}
      <div className="products-page-toolbar">
        {/* LEFT: SEARCH */}
        <div className="products-page-toolbar-search">
          <input
            type="text"
            placeholder=" 🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* RIGHT: SORT + CATEGORY */}
        <div className="products-page-toolbar-actions">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name (A–Z)</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="products-page-no-results">No products found</p>
      ) : (
        <div className="products-page-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;