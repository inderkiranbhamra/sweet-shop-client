import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Trash2, ArrowRight } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const items = cart.map(i => ({ sweet: i.id, name: i.name, quantity: i.quantity, price: i.price }));
      await api.post('/orders', { items, totalAmount: cartTotal });
      clearCart();
      alert('Order Placed Successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Checkout failed.');
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50">
       <Navbar />
       <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
         <h2 className="text-2xl font-bold text-gray-300 mb-4">Your Cart is Empty</h2>
         <p className="text-gray-500">Looks like you haven't added any sweets yet.</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart ({cart.length})</h1>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {cart.map(item => (
            <div key={item.id} className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Product Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">🍬</div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Qty: <span className="font-semibold text-gray-900">{item.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action (Flex Row on Mobile too) */}
              <div className="flex items-center justify-between sm:space-x-6 w-full sm:w-auto mt-2 sm:mt-0 pl-20 sm:pl-0">
                <span className="font-bold text-lg text-gray-900">₹{item.price * item.quantity}</span>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>

            </div>
          ))}
          
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
             <span className="text-gray-500 font-medium">Total Amount</span>
             <span className="text-3xl font-bold text-primary">₹{cartTotal}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout} 
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-pink-600 shadow-lg active:scale-95 transition"
        >
          <span>Checkout Securely</span>
          <ArrowRight />
        </button>
      </main>
    </div>
  );
};

export default CartPage;