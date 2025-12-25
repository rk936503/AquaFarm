import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const FarmerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className='flex-1 overflow-y-auto'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
