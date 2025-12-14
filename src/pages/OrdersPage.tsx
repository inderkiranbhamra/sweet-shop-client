import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders/my-orders').then(res => setOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-4 pb-4 border-b">
                <div>
                   <span className="text-xs text-gray-400 block">Order ID</span>
                   <span className="font-mono text-sm">{order._id}</span>
                </div>
                <div className="text-right">
                   <span className="text-xs text-gray-400 block">Status</span>
                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">COMPLETED</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item: any) => (
                  <div key={item.sweet} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-lg">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
export default OrdersPage;