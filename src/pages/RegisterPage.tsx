import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'CUSTOMER' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  // FIX: Removed 'register' from destructuring since it was unused
  const { verifyOtp, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleRegisterDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 1. If OTP is already sent, verify it
    if (otpSent) {
      try {
        await verifyOtp(formData.email, otp);
        navigate('/');
      } catch (err) {
        setError('Invalid OTP');
      }
      return;
    }

    // 2. Initial Registration Request
    try {
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
        alert(`OTP sent to inderkiranbhamra2003@gmail.com`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {otpSent ? 'Verify Admin Access' : 'Create Account'}
        </h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleRegisterDirect} className="space-y-4">
          {!otpSent && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {formData.role === 'ADMIN' && (
                  <p className="text-xs text-orange-600 mt-1">
                    * Admin accounts require OTP verification via Inderkiran's email.
                  </p>
                )}
              </div>
            </>
          )}

          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-center letter-spacing-2 font-mono text-xl"
                placeholder="123456"
                required
              />
            </div>
          )}

          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-pink-600 transition">
            {otpSent ? 'Verify OTP' : 'Register'}
          </button>
        </form>

        {!otpSent && (
          <>
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    await googleSignIn(credentialResponse);
                    navigate('/');
                  } catch (err) {
                    console.error("Google Signup Error", err);
                    setError("Google Sign-in failed");
                  }
                }}
                onError={() => {
                  console.log('Login Failed');
                  setError('Google Login Failed');
                }}
              />
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;