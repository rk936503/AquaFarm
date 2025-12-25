import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../slices/authSlice';
import { Button, Input, Select } from '../components/FormElements';
import Alert from '../components/Alert';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    role: 'farmer',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup(formData));
    if (result.payload?.token) {
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <h1 className='text-3xl font-bold text-center text-emerald-600 mb-2'>WaterDash</h1>
          <p className='text-center text-gray-600 mb-8'>Create your account</p>

          {error && <Alert type='error' message={error} />}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              type='text'
              name='name'
              label='Full Name'
              placeholder='Enter your name'
              required
              value={formData.name}
              onChange={handleChange}
            />
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
              minLength='6'
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              type='tel'
              name='phone'
              label='Phone Number'
              placeholder='9435185277'
              required
              maxLength='10'
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              type='text'
              name='location'
              label='Location'
              placeholder='City/Village'
              required
              value={formData.location}
              onChange={handleChange}
            />

            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className='mt-6 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-emerald-600 font-semibold hover:underline'>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
