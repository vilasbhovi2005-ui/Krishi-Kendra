import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PackagePlus, Edit, Trash2 } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Seeds',
    stock: '',
    image: ''
  });

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('/api/products/seller/myproducts', {
         // Using cookie based auth implies we might need to send credentials or pass token
      });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get('/api/orders/seller/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchMyOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      setShowForm(false);
      fetchMyProducts();
      setFormData({ title: '', description: '', price: '', category: 'Seeds', stock: '', image: '' });
    } catch (error) {
      console.error('Error adding product', error);
      alert('Failed to add product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchMyProducts();
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await axios.put(`/api/products/${id}`, { stock: Number(newStockValue) });
      setEditingStockId(null);
      fetchMyProducts();
    } catch (error) {
      console.error('Error updating stock', error);
      alert('Failed to update stock');
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center flex-col-mobile" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Seller Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <PackagePlus size={20} /> Add New Product
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 'var(--dashboard-padding, 2rem)', marginBottom: '2rem', background: '#f8faf9' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Seeds">Seeds</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Pesticides">Pesticides</option>
                <option value="Machinery">Machinery</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input type="number" name="stock" className="form-input" value={formData.stock} onChange={handleChange} min="0" required />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Image URL (Optional)</label>
              <input type="text" name="image" className="form-input" value={formData.image} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" value={formData.description} onChange={handleChange} rows="3" required></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button>
              <button type="submit" className="btn btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Products</h2>
        {loading ? (
          <p>Loading your products...</p>
        ) : products.length === 0 ? (
          <div className="card" style={{ padding: 'var(--empty-padding, 3rem)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>You haven't added any products yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <thead style={{ backgroundColor: 'var(--background)', textAlign: 'left' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Product</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Category</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Price</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Stock</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span style={{ fontWeight: 500 }}>{product.title}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>${product.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      {editingStockId === product._id ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="number" 
                            className="form-input" 
                            style={{ width: '70px', padding: '0.25rem' }} 
                            value={newStockValue} 
                            onChange={e => setNewStockValue(e.target.value)} 
                            min="0" 
                          />
                          <button onClick={() => handleUpdateStock(product._id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Save</button>
                          <button onClick={() => setEditingStockId(null)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ color: product.stock === 0 ? 'var(--danger)' : 'inherit', fontWeight: product.stock === 0 ? 700 : 400 }}>
                            {product.stock} {product.stock === 0 && '(Out of Stock)'}
                          </span>
                          <button onClick={() => { setEditingStockId(product._id); setNewStockValue(product.stock); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.2rem' }} title="Update Stock">
                            <Edit size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(product._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customer Orders</h2>
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: 'var(--empty-padding, 3rem)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>You have no customer orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map(order => (
              <div key={order._id} className="card" style={{ padding: '1.5rem' }}>
                <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order ID: {order._id.substring(order._id.length - 8)}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ background: 'rgba(46, 125, 50, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600 }}>
                    {order.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Customer Details</h4>
                    <p style={{ fontWeight: 500 }}>{order.buyer?.fullName}</p>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{order.buyer?.email}</p>
                    
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', marginTop: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Shipping Address</h4>
                    <p style={{ lineHeight: 1.5 }}>
                      {order.shippingAddress?.street}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Payment Info</h4>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                      <span style={{ color: 'var(--primary)' }}>•</span> {order.paymentMethod || 'Cash on Delivery'}
                    </p>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Your Earnings for this Order</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>${order.sellerTotal?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Products Ordered</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items.map(item => (
                      <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <img src={item.product?.image} alt={item.product?.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{item.product?.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                        </div>
                        <div style={{ fontWeight: 700 }}>
                          ${(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
