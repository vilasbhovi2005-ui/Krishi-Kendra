import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      if (search) url += `search=${search}&`;
      if (category) url += `category=${category}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container">
      {/* Hero Banner */}
      <div className="card flex items-center justify-between flex-col-mobile" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', color: 'white', padding: 'var(--hero-padding, 3rem)', marginBottom: '2rem' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Everything for your farm, in one place.</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '2rem' }}>Quality seeds, reliable fertilizers, and modern machinery directly from verified sellers to your farm.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card flex-col-mobile" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <Filter size={20} color="var(--text-muted)"/>
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.5rem', width: '200px' }}>
            <option value="">All Categories</option>
            <option value="Seeds">Seeds</option>
            <option value="Fertilizers">Fertilizers</option>
            <option value="Pesticides">Pesticides</option>
            <option value="Machinery">Machinery</option>
            <option value="Tools">Tools</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex" style={{ flex: 1, width: '100%', maxWidth: '500px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search products..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No products found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={`/product/${product._id}`} key={product._id} className="card flex flex-col" style={{ display: 'flex' }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} className="product-img" />
              </div>
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{product.category}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.title}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>${product.price.toFixed(2)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock: {product.stock}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
