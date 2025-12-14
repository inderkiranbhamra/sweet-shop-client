import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Candy, ArrowLeft, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // Ensure you have this route in your backend!
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('Password reset link sent! Check your inbox.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-6 flex items-center space-x-2 text-primary">
         <Candy size={40} />
         <span className="text-3xl font-bold font-serif">SweetShop</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <Link to="/login" className="flex items-center text-gray-500 hover:text-primary mb-6 transition">
            <ArrowLeft size={16} className="mr-1" /> Back to Login
        </Link>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
        <p className="text-gray-500 mb-6 text-sm">Enter your email and we'll send you a link to reset your password.</p>

        {status === 'success' ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center border border-green-100">
             <div className="flex justify-center mb-2"><Mail size={32} /></div>
             <p className="font-bold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            {status === 'error' && <div className="text-red-500 text-sm font-bold text-center">{message}</div>}

            <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;