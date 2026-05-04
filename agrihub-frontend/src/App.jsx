import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SellerDashboard from './pages/SellerDashboard';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Leaf color="var(--primary)" size={28} />
          AgriHub
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Home</Link>
          {user ? (
            <>
              {user.role === 'seller' && (
                <Link to="/dashboard" className="btn btn-outline">
                  <Package size={20}/> Dashboard
                </Link>
              )}
              {user.role === 'farmer' && (
                <Link to="/cart" className="btn btn-primary" style={{position: 'relative'}}>
                  <ShoppingCart size={20}/> Cart
                  {cartItems.length > 0 && (
                    <span style={{
                      position: 'absolute', top: '-5px', right: '-5px', 
                      background: 'var(--danger)', color: 'white', borderRadius: '50%',
                      width: '20px', height: '20px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'
                    }}>{cartItems.length}</span>
                  )}
                </Link>
              )}
              <div className="flex items-center gap-4 ml-4" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1rem'}}>
                <span style={{fontWeight: 500, color: 'var(--text-main)'}}>
                  {user.fullName} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{padding: '0.4rem'}}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <Navbar />
        <main className="flex-1" style={{ padding: '2rem 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
          </Routes>
        </main>
        <footer style={{ background: 'var(--primary-dark)', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
          <p>&copy; {new Date().getFullYear()} Agricultural Hub. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
