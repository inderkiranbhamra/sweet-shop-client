import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Plus, Trash2, Image as ImageIcon, Pencil } from 'lucide-react'; // Added Pencil icon

const AdminPage: React.FC = () => {
  const [sweets, setSweets] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'ORDERS'>('INVENTORY');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // New: Track which ID we are editing
  const [formData, setFormData] = useState({ name: '', category: '', price: 0, quantity: 0, image: '' }); // Renamed newSweet to formData for clarity

  useEffect(() => {
    fetchSweets();
    fetchOrders();
  }, []);

  const fetchSweets = async () => {
    try { const res = await api.get('/sweets'); setSweets(res.data); } catch(e) {}
  };
  
  const fetchOrders = async () => {
    try { const res = await api.get('/orders/admin-all'); setOrders(res.data); } catch(e) {}
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // New: Open Modal in "Add Mode"
  const openAddModal = () => {
    setEditingId(null); // Reset ID
    setFormData({ name: '', category: '', price: 0, quantity: 0, image: '' }); // Reset Form
    setIsModalOpen(true);
  };

  // New: Open Modal in "Edit Mode"
  const handleEdit = (sweet: any) => {
    setEditingId(sweet._id);
    setFormData({ 
      name: sweet.name, 
      category: sweet.category, 
      price: sweet.price, 
      quantity: sweet.quantity, 
      image: sweet.image || '' 
    });
    setIsModalOpen(true);
  };

  // Updated: Handles both Create (POST) and Update (PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing sweet
        await api.put(`/sweets/${editingId}`, formData);
      } else {
        // Create new sweet
        await api.post('/sweets', formData);
      }
      fetchSweets();
      setIsModalOpen(false);
      setFormData({ name: '', category: '', price: 0, quantity: 0, image: '' });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save sweet", error);
      alert("Something went wrong while saving.");
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm('Delete this item?')) return;
    await api.delete(`/sweets/${id}`);
    fetchSweets();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab('INVENTORY')} className={`flex-shrink-0 px-6 py-2 rounded-lg font-bold text-sm md:text-base ${activeTab === 'INVENTORY' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Inventory</button>
          <button onClick={() => setActiveTab('ORDERS')} className={`flex-shrink-0 px-6 py-2 rounded-lg font-bold text-sm md:text-base ${activeTab === 'ORDERS' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>All Orders</button>
        </div>

        {activeTab === 'INVENTORY' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Products</h1>
              <button onClick={openAddModal} className="bg-primary text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-600 shadow-md text-sm md:text-base">
                <Plus size={18} /> <span>Add</span>
              </button>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sweets.map(sweet => (
                <div key={sweet._id} className="bg-white p-3 rounded-xl shadow-sm border flex items-center space-x-3 group">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {sweet.image ? <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400 m-auto h-full p-2" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate text-gray-800">{sweet.name}</h3>
                    <p className="text-xs text-gray-500">₹{sweet.price} • Stock: <span className={sweet.quantity < 10 ? 'text-red-500 font-bold' : ''}>{sweet.quantity}</span></p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button onClick={() => handleEdit(sweet)} className="text-gray-400 hover:text-blue-500 p-2 hover:bg-blue-50 rounded-full transition">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(sweet._id)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition">
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Orders Table (Unchanged) */
          <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-500">{order._id.slice(-6)}...</td>
                      <td className="p-4 text-sm">{order.user?.email || 'Guest'}</td>
                      <td className="p-4 font-bold text-green-600">₹{order.totalAmount}</td>
                      <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">Paid</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal - Handles both Add and Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
            <div className="bg-white p-5 md:p-8 rounded-2xl w-full max-w-md shadow-2xl relative animate-fadeIn">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Sweet' : 'Add Sweet'}</h2>
              <form onSubmit={handleSave} className="space-y-3">
                <input 
                  placeholder="Name" 
                  value={formData.name}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  required 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                  placeholder="Category" 
                  value={formData.category}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  required 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                />
                <div className="flex space-x-3">
                  <input 
                    type="number" 
                    placeholder="Price" 
                    value={formData.price}
                    className="w-1/2 border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                    required 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                  />
                  <input 
                    type="number" 
                    placeholder="Qty" 
                    value={formData.quantity}
                    className="w-1/2 border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                    required 
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} 
                  />
                </div>
                
                <div className="border-2 border-dashed border-gray-200 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition">
                   <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                </div>
                
                {formData.image && <img src={formData.image} alt="Preview" className="h-24 w-full object-contain bg-gray-50 rounded" />}
                
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-pink-600 shadow-lg">
                    {editingId ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;