import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser, updateUserProfile } from '../slices/userSlice';
import { Button, Input, Select } from '../components/FormElements';
import Alert from '../components/Alert';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    state: '',
    district: '',
    farmSize: '',
  });

  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    } else {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        state: user.state || '',
        district: user.district || '',
        farmSize: user.farmSize || '',
      });
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUserProfile(formData));
    if (result.payload) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (loading && !user) {
    return <div className='text-center py-12'>Loading profile...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Profile</h1>
      <p className='text-gray-600 mb-8'>Manage your account information and preferences</p>

      {showSuccess && (
        <Alert type='success' message='Profile updated successfully!' />
      )}
      {error && <Alert type='error' message={error} />}

      <div className='max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='label'>Email Address</label>
            <input
              type='email'
              value={user?.email || ''}
              disabled
              className='input-field bg-gray-100 cursor-not-allowed'
            />
            <p className='text-xs text-gray-500 mt-1'>Email cannot be changed</p>
          </div>

          <Input
            type='text'
            name='name'
            label='Full Name'
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            type='tel'
            name='phone'
            label='Phone Number'
            placeholder='9876543210'
            maxLength='10'
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <Input
            type='text'
            name='location'
            label='Village/City'
            value={formData.location}
            onChange={handleChange}
            required
          />

          <Input
            type='text'
            name='state'
            label='State'
            value={formData.state}
            onChange={handleChange}
          />

          <Input
            type='text'
            name='district'
            label='District'
            value={formData.district}
            onChange={handleChange}
          />

          <Input
            type='number'
            name='farmSize'
            label='Farm Size (Acres)'
            placeholder='5'
            step='0.1'
            min='0.1'
            value={formData.farmSize}
            onChange={handleChange}
          />

          <div className='pt-4'>
            <Button type='submit' disabled={loading} className='w-full'>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
