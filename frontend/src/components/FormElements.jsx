import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none';
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => {
  return (
    <div className='mb-4'>
      {label && <label className='label'>{label}</label>}
      <input className='input-field' {...props} />
      {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export const Select = ({ label, error, children, ...props }) => {
  return (
    <div className='mb-4'>
      {label && <label className='label'>{label}</label>}
      <select className='input-field' {...props}>
        {children}
      </select>
      {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, ...props }) => {
  return (
    <div className='mb-4'>
      {label && <label className='label'>{label}</label>}
      <textarea className='input-field resize-vertical' {...props} />
      {error && <p className='text-red-600 text-sm mt-1'>{error}</p>}
    </div>
  );
};

export default { Button, Input, Select, Textarea };
