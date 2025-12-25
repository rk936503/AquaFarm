import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-stone-900 via-emerald-900 to-stone-900'>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
