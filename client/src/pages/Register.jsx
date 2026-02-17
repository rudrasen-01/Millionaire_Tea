import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/buttons/PrimaryButton';


export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [image, setImage] = useState(null);   // 👈 NEW
  const [preview, setPreview] = useState(null); // 👈 NEW


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.email) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email';
    if (!form.password) err.password = 'Password is required';
    else if (form.password.length < 8) err.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Passwords do not match';
    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  // 👇 Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v = validate();
    if (Object.keys(v).length) return setErrors(v);

    setIsSubmitting(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);

      if (image) {
        formData.append("image", image);  // 👈 important
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        body: formData   // 👈 NO headers here
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data?.message || 'Registration failed');
        setIsSubmitting(false);
        return;
      }

      navigate('/verify', {
        replace: true,
        state: { email: form.email.trim(), message: data?.message }
      });

    } catch (err) {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-card p-8">
        <h2 className="text-2xl font-bold mb-4">Create an account</h2>

        {serverError && (
          <div className="mb-4 text-sm text-red-600">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
          </div>

          {/* Profile Image */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full border"
              />
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.password && <div className="text-xs text-red-600 mt-1">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.confirmPassword && <div className="text-xs text-red-600 mt-1">{errors.confirmPassword}</div>}
          </div>

          <PrimaryButton type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating account…' : 'Register'}
          </PrimaryButton>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate('/login')}
            className="text-amber-600 font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
