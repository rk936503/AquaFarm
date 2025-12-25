import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplet,
  TrendingUp,
  User,
  Users,
  Settings,
} from 'tabler-icons-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isFarmer = user?.role === 'farmer';

  const farmerMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/farmer/dashboard' },
    { label: 'Water Log', icon: Droplet, path: '/farmer/water-log' },
    { label: 'Analytics', icon: TrendingUp, path: '/farmer/analytics' },
    { label: 'Profile', icon: User, path: '/farmer/profile' },
  ];

  const adminMenuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'All Farmers', icon: Users, path: '/admin/farmers' },
    { label: 'Water Analytics', icon: TrendingUp, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const menuItems = isFarmer ? farmerMenuItems : adminMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-stone-900 text-white transform transition-transform duration-200 z-40 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-6'>
          <h2 className='text-2xl font-bold text-emerald-500'>AquaFarm</h2>
          <p className='text-sm text-gray-400 mt-1'>Irrigation Optimizer</p>
        </div>

        <nav className='mt-8 px-4'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-300 hover:bg-stone-800'
                }`}
              >
                <Icon size={20} />
                <span className='font-medium'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-4 left-4 right-4 p-4 bg-stone-800 rounded-lg'>
          <p className='text-xs text-gray-400'>Logged in as</p>
          <p className='text-sm font-semibold text-white truncate'>{user?.email}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
