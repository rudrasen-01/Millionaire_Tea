import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../components/buttons/PrimaryButton';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registeredState = location.state?.registered;
  const { setUser, setCurrentPage } = useApp();

  useEffect(() => {
    if (registeredState) {
      setError(location.state?.message || 'Registration successful. Please log in.');
    }
  }, [registeredState, location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Provide email and password');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || 'Login failed');
        setIsSubmitting(false);
        return;
      }
      // Refresh the server-side user object to ensure role/rank are normalized
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          const meData = await meRes.json();
          const userObj = meData.user || data.user || null;
          setUser(userObj);
          setCurrentPage(userObj && userObj.role === 'admin' ? 'admin' : 'dashboard');
        } else {
          const userObj = data.user || null;
          setUser(userObj);
          setCurrentPage(userObj && userObj.role === 'admin' ? 'admin' : 'dashboard');
        }
      } catch (e) {
        const userObj = data.user || null;
        setUser(userObj);
        setCurrentPage(userObj && userObj.role === 'admin' ? 'admin' : 'dashboard');
      }
      navigate('/app', { replace: true });
    } catch (err) {
      setError('Network error. Try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cream via-warmWhite to-cream">
      <div className="w-full max-w-md bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-darkBrown font-baloo">Sign in</h2>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1 text-darkBrown">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-darkBrown">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2 border-2 border-caramel/30 bg-warmWhite rounded-lg focus:outline-none focus:ring-2 focus:ring-caramel focus:border-caramel" />
          </div>
          <PrimaryButton type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-caramel to-darkBrown text-cream hover:shadow-lg">{isSubmitting ? 'Signing in…' : 'Sign in'}</PrimaryButton>
        </form>
        <div className="mt-4 text-sm text-center text-darkBrown">
          Don't have an account? <button onClick={() => navigate('/register')} className="text-caramel font-semibold hover:text-darkBrown transition-colors">Register</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
