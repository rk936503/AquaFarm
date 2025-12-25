import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { Menu, Logout, User, Settings } from 'tabler-icons-react';

const Header = ({ onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className='bg-white border-b border-gray-200 sticky top-0 z-40'>
      <div className='px-4 py-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={onMenuToggle}
              className='lg:hidden p-2 hover:bg-gray-100 rounded-lg'
            >
              <Menu size={24} />
            </button>
            <h1 className='text-xl font-bold text-gray-900'>AquaFarm</h1>
          </div>

          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
                <p className='text-xs text-gray-500 capitalize'>{user?.role}</p>
              </div>
              <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                <User size={20} className='text-green-700' />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className='p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600'
              title='Logout'
            >
              <Logout size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
