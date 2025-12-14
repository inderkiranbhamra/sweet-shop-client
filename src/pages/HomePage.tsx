import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import Auth Context
import { Search, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import Navigation

const HomePage: React.FC = () => {
  const [sweets, setSweets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth(); // Get current user
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/sweets')
      .then(res => setSweets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter Logic
  const filtered = sweets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Handle Add to Cart Click
  const handleAddToCart = (sweet: any) => {
    if (!user) {
      // If user is NOT logged in, ask to redirect
      const confirmLogin = window.confirm("You need to login to add items to your cart. Go to Login page?");
      if (confirmLogin) {
        navigate('/login');
      }
      return; // Stop execution
    }

    // If logged in, proceed to add to cart
    addToCart({ 
      id: sweet._id, 
      name: sweet.name, 
      price: sweet.price, 
      quantity: 1, 
      maxStock: sweet.quantity, 
      image: sweet.image 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary py-8 md:py-16 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">Taste the Magic</h1>
        <p className="opacity-90 text-sm md:text-lg">Premium sweets delivered to your doorstep.</p>
      </div>

      <main className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">
        {/* Search Bar */}
        <div className="max-w-full md:max-w-xl mx-auto mb-8 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" />
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-pink-400 outline-none text-gray-800" 
              placeholder="Search sweets or categories..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
           <div className="text-center mt-10">Loading tasty treats...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(sweet => (
              <div key={sweet._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 md:h-56 bg-gray-100 overflow-hidden relative">
                  {sweet.image ? (
                    <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍬</div>
                  )}
                  {sweet.quantity === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold uppercase tracking-wider backdrop-blur-sm">Sold Out</div>
                  )}
                </div>
                
                <div className="p-4 md:p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{sweet.name}</h3>
                    <span className="bg-pink-100 text-pink-600 text-[10px] uppercase font-bold px-2 py-1 rounded-md whitespace-nowrap">{sweet.category}</span>
                  </div>
                  
                  <div className="flex-grow"></div> 
                  
                  <div className="flex items-center justify-between mt-4">
                      <span className="text-xl md:text-2xl font-bold text-gray-900">₹{sweet.price}</span>
                      <span className="text-xs text-gray-500">{sweet.quantity} left</span>
                  </div>

                  <button 
                    disabled={sweet.quantity === 0}
                    // UPDATED: Now calls handleAddToCart instead of direct addToCart
                    onClick={() => handleAddToCart(sweet)}
                    className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition"
                  >
                    <ShoppingBag size={18} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;