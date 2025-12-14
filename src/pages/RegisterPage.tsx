import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Candy, CheckCircle, Mail, Lock, User as UserIcon, KeyRound } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'CUSTOMER' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { verifyOtp, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleRegisterDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // 1. If OTP is already sent, verify it
    if (otpSent) {
      try {
        await verifyOtp(formData.email, otp);
        navigate('/');
      } catch (err) {
        setError('Invalid OTP. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2. Initial Registration Request
    try {
      // Note: Using fetch here directly because we might not have a token yet
      const response = await fetch('https://sweet-shop-api.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.status === 201) {
        alert("Account Created! Please Login.");
        navigate('/login');
      } else if (response.status === 202) {
        setOtpSent(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* Logo Header */}
      <div className="mb-6 flex items-center space-x-2 text-primary animate-fadeIn">
         <Candy size={40} />
         <span className="text-3xl font-bold font-serif">SweetShop</span>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm md:max-w-md border border-gray-100 transition-all duration-300">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
          {otpSent ? 'Verify Admin Access' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          {otpSent ? 'Enter the code sent to the admin email' : 'Join us to get the sweetest deals!'}
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100 flex items-center animate-pulse">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleRegisterDirect} className="space-y-4">
          {!otpSent && (
            <>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none transition text-gray-700"
                >
                  <option value="CUSTOMER">Customer Account</option>
                  <option value="ADMIN">Admin Account</option>
                </select>
                {formData.role === 'ADMIN' && (
                  <p className="text-[10px] text-orange-600 mt-1 font-medium bg-orange-50 p-1 rounded">
                    * Requires OTP verification sent to owner
                  </p>
                )}
              </div>
            </>
          )}

          {otpSent && (
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password</label>
              <div className="relative max-w-[200px] mx-auto">
                <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-primary/30 rounded-xl text-center tracking-[0.5em] font-mono text-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
              <div className="mt-4 text-xs text-green-600 flex justify-center items-center">
                <CheckCircle size={14} className="mr-1" /> OTP Sent Successfully
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-pink-600 transition shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (otpSent ? 'Verify & Create' : 'Create Account')}
          </button>
        </form>

        {!otpSent && (
          <>
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-4 text-gray-400 text-xs uppercase font-bold tracking-wider">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex justify-center w-full">
              <div className="w-full flex justify-center">
                 <GoogleLogin
                    onSuccess={async (res) => {
                      try { await googleSignIn(res); navigate('/'); } 
                      catch(e) { setError("Google Sign-in failed"); }
                    }}
                    onError={() => setError('Google Login Failed')}
                    shape="pill"
                    width="300" // Helps responsiveness
                 />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;