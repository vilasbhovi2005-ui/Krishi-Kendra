import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PackagePlus, Edit, Trash2 } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
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

  useEffect(() => {
    fetchMyProducts();
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
                    <td style={{ padding: '1rem' }}>{product.stock}</td>
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
    </div>
  );
};

export default SellerDashboard;
