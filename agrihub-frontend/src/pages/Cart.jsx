import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setPlacingOrder(true);
    try {
      const items = cartItems.map(item => ({ product: item.product._id, quantity: item.quantity }));
      await axios.post('/api/orders', { items, shippingAddress }, {
        headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` } // In reality, handle token better
      });
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order. Check console.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: 'var(--hero-padding, 4rem) 0' }}>
        <div style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <ShoppingBag size={48} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Thank you for your purchase. The seller will be notified to process your order.</p>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card" style={{ padding: 'var(--cart-padding, 1.5rem)' }}>
            {cartItems.map(item => (
              <div key={item.product._id} style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <img src={item.product.image} alt={item.product.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{item.product.title}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>${item.product.price.toFixed(2)}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: 'fit-content' }}>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} style={{ padding: '0.25rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '0 0.75rem', fontWeight: 500 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} style={{ padding: '0.25rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product._id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 'var(--cart-padding, 1.5rem)', position: 'sticky', top: '5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cartItems.length} items)</span>
              <span style={{ fontWeight: 500 }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: 500 }}>$10.00</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span>${(cartTotal + 10).toFixed(2)}</span>
            </div>

            <form onSubmit={handleCheckout}>
              <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Shipping Information</h4>
              <input type="text" placeholder="Street Address" className="form-input" style={{ width: '100%', marginBottom: '0.5rem' }} value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} required />
              <input type="text" placeholder="City" className="form-input" style={{ width: '100%', marginBottom: '0.5rem' }} value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} required />
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input type="text" placeholder="State" className="form-input" style={{ width: '50%' }} value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} required />
                <input type="text" placeholder="Zip Code" className="form-input" style={{ width: '50%' }} value={shippingAddress.zipCode} onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})} required />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={placingOrder}>
                {placingOrder ? 'Processing...' : `Pay $${(cartTotal + 10).toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
