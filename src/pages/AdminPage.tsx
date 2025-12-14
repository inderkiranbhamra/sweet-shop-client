import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react'; // Removed RefreshCcw

interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const AdminPage: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSweet, setNewSweet] = useState({ name: '', category: '', price: 0, quantity: 0 });

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const res = await api.get('/sweets');
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this sweet?')) return;
    try {
      await api.delete(`/sweets/${id}`);
      setSweets(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleAddSweet = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/sweets', newSweet);
      setSweets([...sweets, res.data]);
      setIsModalOpen(false);
      setNewSweet({ name: '', category: '', price: 0, quantity: 0 });
    } catch (err) {
      alert('Failed to add sweet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-600"
          >
            <Plus size={20} />
            <span>Add New Sweet</span>
          </button>
        </div>

        {/* --- ADD MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Sweet</h2>
              <form onSubmit={handleAddSweet} className="space-y-3">
                <input placeholder="Name" className="w-full border p-2 rounded" required 
                  value={newSweet.name} onChange={e => setNewSweet({...newSweet, name: e.target.value})} />
                <input placeholder="Category" className="w-full border p-2 rounded" required 
                  value={newSweet.category} onChange={e => setNewSweet({...newSweet, category: e.target.value})} />
                <div className="flex space-x-2">
                  <input type="number" placeholder="Price" className="w-1/2 border p-2 rounded" required 
                    value={newSweet.price} onChange={e => setNewSweet({...newSweet, price: Number(e.target.value)})} />
                  <input type="number" placeholder="Qty" className="w-1/2 border p-2 rounded" required 
                    value={newSweet.quantity} onChange={e => setNewSweet({...newSweet, quantity: Number(e.target.value)})} />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-2 rounded">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-500 py-2">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* --- TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sweets.map(sweet => (
                <tr key={sweet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{sweet.name}</td>
                  <td className="px-6 py-4 text-gray-500">${sweet.price}</td>
                  <td className="px-6 py-4 text-gray-500">{sweet.quantity}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleDelete(sweet._id)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;