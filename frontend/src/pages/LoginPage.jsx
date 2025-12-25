import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';
import { Button, Input } from '../components/FormElements';
import Alert from '../components/Alert';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.payload?.token) {
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-center text-emerald-600 mb-2'>WaterDash</h1>
          <p className='text-center text-gray-600 mb-8'>Sign in to your account</p>

          {error && <Alert type='error' message={error} />}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              type='email'
              name='email'
              label='Email Address'
              placeholder='your@email.com'
              required
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type='password'
              name='password'
              label='Password'
              placeholder='••••••••'
              required
              value={formData.password}
              onChange={handleChange}
            />

            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-emerald-600 font-semibold hover:underline'>
              Sign up
            </Link>
          </div>

          <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-xs text-blue-800'>
              <strong>Demo Credentials:</strong>
              <br />
              Email: farmer@example.com
              <br />
              Password: password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
