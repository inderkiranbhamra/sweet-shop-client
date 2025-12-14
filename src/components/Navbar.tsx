import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Candy, LogOut, Shield } from 'lucide-react'; // Removed ShoppingBag

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Candy size={28} />
          <span>SweetShop</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <span className="text-sm font-medium">Hello, {user.email}</span>
              {isAdmin && (
                <Link to="/admin" className="flex items-center space-x-1 hover:text-pink-100">
                  <Shield size={18} />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-pink-100">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-pink-100">Login</Link>
              <Link to="/register" className="bg-white text-primary px-4 py-1.5 rounded-full font-medium hover:bg-gray-100 transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;