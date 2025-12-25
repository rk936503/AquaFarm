import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../slices/userSlice';
import { formatDate } from '../utils/helpers';

const FarmersListPage = () => {
  const dispatch = useDispatch();
  const { users, loading, pagination } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers({ role: 'farmer', limit: 50 }));
  }, [dispatch]);

  if (loading) {
    return <div className='text-center py-12'>Loading farmers...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Farmers Directory</h1>
      <p className='text-gray-600 mb-8'>
        Total farmers: <strong>{pagination?.total || 0}</strong>
      </p>

      <div className='card overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Name</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Email</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Phone</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Location</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Farm Size</th>
              <th className='text-left py-3 px-4 font-semibold text-gray-700'>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((farmer) => (
              <tr key={farmer.id} className='border-b border-gray-100 hover:bg-gray-50'>
                <td className='py-3 px-4 text-gray-700 font-medium'>{farmer.name}</td>
                <td className='py-3 px-4 text-gray-600'>{farmer.email}</td>
                <td className='py-3 px-4 text-gray-600'>{farmer.phone}</td>
                <td className='py-3 px-4 text-gray-600'>{farmer.location}</td>
                <td className='py-3 px-4 text-gray-600'>
                  {farmer.farmSize ? `${farmer.farmSize} acres` : '—'}
                </td>
                <td className='py-3 px-4 text-gray-600 text-sm'>
                  {formatDate(farmer.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmersListPage;
