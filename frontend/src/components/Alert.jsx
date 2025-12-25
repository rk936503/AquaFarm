import React from 'react';
import { AlertCircle, Check, AlertTriangle } from 'tabler-icons-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const Icon = {
    info: AlertCircle,
    success: Check,
    warning: AlertTriangle,
    error: AlertCircle,
  }[type];

  return (
    <div className={`card border ${typeClasses[type]} mb-4`}>
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-3'>
          <Icon size={20} className='mt-0.5 flex-shrink-0' />
          <div>
            {title && <h4 className='font-semibold mb-1'>{title}</h4>}
            <p className='text-sm'>{message}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className='text-2xl leading-none hover:opacity-70'>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
