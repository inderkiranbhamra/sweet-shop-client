import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SweetCard from '../components/SweetCard';
import api from '../api/axios';
import { Search, Loader } from 'lucide-react';

// --- DEFINED LOCALLY TO FIX IMPORT ERROR ---
interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}
// -------------------------------------------

const HomePage: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Sweets from Backend
  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get<Sweet[]>('/sweets');
      setSweets(res.data);
    } catch (err) {
      console.error('Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (id: string) => {
    try {
      // Optimistic Update (update UI immediately)
      setSweets(prev => prev.map(s => 
        s._id === id ? { ...s, quantity: s.quantity - 1 } : s
      ));
      
      // API Call
      await api.post(`/sweets/${id}/purchase`);
      alert('Purchase successful!');
    } catch (err) {
      alert('Purchase failed');
      fetchSweets(); // Revert on failure
    }
  };

  const filteredSweets = sweets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search for sweets..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-20"><Loader className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSweets.map(sweet => (
              // Map MongoDB _id to the id prop expected by SweetCard
              <SweetCard key={sweet._id} sweet={{...sweet, id: sweet._id}} onPurchase={() => handlePurchase(sweet._id)} />
            ))}
          </div>
        )}
        
        {!loading && filteredSweets.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No sweets found.</div>
        )}
      </main>
    </div>
  );
};

export default HomePage;