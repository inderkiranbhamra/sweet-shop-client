import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Candy, LogOut, Shield, ShoppingCart, Package, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold font-serif" onClick={() => setIsMenuOpen(false)}>
            <Candy size={32} className="text-yellow-300" />
            <span>SweetShop</span>
          </Link>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks 
              user={user} 
              isAdmin={isAdmin} 
              cartCount={cartCount} 
              handleLogout={handleLogout} 
            />
          </div>

          {/* Mobile Menu Button (Visible on Mobile) */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-pink-400 pt-4 animate-fadeIn">
             <MobileNavLinks 
               user={user} 
               isAdmin={isAdmin} 
               cartCount={cartCount} 
               handleLogout={handleLogout}
               closeMenu={() => setIsMenuOpen(false)}
             />
          </div>
        )}
      </div>
    </nav>
  );
};

// Sub-component for Desktop Links
const NavLinks = ({ user, isAdmin, cartCount, handleLogout }: any) => (
  <>
    {user ? (
      <>
        {!isAdmin && (
          <>
            <Link to="/orders" className="flex items-center hover:text-pink-200 transition">
              <Package size={20} className="mr-1" /> Orders
            </Link>
            <Link to="/cart" className="relative flex items-center hover:text-pink-200 transition">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-pink-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}
        
        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
          {user.email.split('@')[0]}
        </span>

        {isAdmin && (
          <Link to="/admin" className="flex items-center space-x-1 hover:text-pink-200 font-bold text-yellow-300 transition">
            <Shield size={18} />
            <span>Admin</span>
          </Link>
        )}
        <button onClick={handleLogout} className="hover:text-red-200 transition" title="Logout">
          <LogOut size={20} />
        </button>
      </>
    ) : (
      <div className="space-x-4">
        <Link to="/login" className="hover:text-pink-200 font-medium transition">Login</Link>
        <Link to="/register" className="bg-white text-pink-600 px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-md">
          Register
        </Link>
      </div>
    )}
  </>
);

// Sub-component for Mobile Links
const MobileNavLinks = ({ user, isAdmin, cartCount, handleLogout, closeMenu }: any) => (
  <div className="flex flex-col space-y-4">
    {user ? (
      <>
        <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
           <span className="font-bold">Hi, {user.email.split('@')[0]}</span>
           {isAdmin && <span className="text-yellow-300 font-bold text-xs uppercase border border-yellow-300 px-2 rounded">Admin</span>}
        </div>

        {!isAdmin && (
          <>
            <Link to="/orders" onClick={closeMenu} className="flex items-center space-x-2 py-2 hover:bg-white/10 rounded px-2">
              <Package size={20} /> <span>My Orders</span>
            </Link>
            <Link to="/cart" onClick={closeMenu} className="flex items-center space-x-2 py-2 hover:bg-white/10 rounded px-2 justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart size={20} /> <span>My Cart</span>
              </div>
              {cartCount > 0 && <span className="bg-yellow-400 text-pink-900 text-xs font-bold rounded-full px-2 py-1">{cartCount} Items</span>}
            </Link>
          </>
        )}

        {isAdmin && (
          <Link to="/admin" onClick={closeMenu} className="flex items-center space-x-2 py-2 hover:bg-white/10 rounded px-2 text-yellow-300">
            <Shield size={20} /> <span>Admin Dashboard</span>
          </Link>
        )}

        <button onClick={handleLogout} className="flex items-center space-x-2 py-2 text-red-200 hover:bg-white/10 rounded px-2 w-full text-left">
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </>
    ) : (
      <div className="flex flex-col space-y-3">
        <Link to="/login" onClick={closeMenu} className="text-center py-2 border border-white/30 rounded-lg hover:bg-white/10">Login</Link>
        <Link to="/register" onClick={closeMenu} className="text-center py-2 bg-white text-pink-600 rounded-lg font-bold">Register</Link>
      </div>
    )}
  </div>
);

export default Navbar;