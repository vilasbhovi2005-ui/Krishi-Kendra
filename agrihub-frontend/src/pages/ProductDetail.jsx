import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'farmer') {
      alert('Only farmers can buy products.');
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>Product not found</div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '2rem', border: 'none', paddingLeft: 0 }}>
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div className="card grid grid-cols-1 md:grid-cols-2" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', minHeight: '400px', background: '#f9f9f9' }}>
          <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        
        <div style={{ padding: '3rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            {product.category}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{product.title}</h1>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
            ${product.price.toFixed(2)}
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{product.description}</p>
          </div>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Seller</span>
              <span style={{ fontWeight: 500 }}>{product.seller?.fullName || 'Unknown Seller'}</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Availability</span>
              <span style={{ fontWeight: 500, color: product.stock > 0 ? 'var(--primary)' : 'var(--danger)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                disabled={product.stock === 0}
              >-</button>
              <span style={{ padding: '0 1rem', fontWeight: 500 }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                style={{ padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
                disabled={product.stock === 0}
              >+</button>
            </div>
            
            <button 
              className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`} 
              style={{ flex: 1, padding: '1rem' }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {added ? <><CheckCircle size={20} /> Added to Cart</> : <><ShoppingCart size={20} /> Add to Cart</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
