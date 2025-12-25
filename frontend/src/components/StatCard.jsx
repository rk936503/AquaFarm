import React from 'react';
import { AlertCircle, TrendingDown, AlertTriangle } from 'tabler-icons-react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'green' }) => {
  const colorClasses = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <div className={`card border ${colorClasses[color]}`}>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-gray-600 mb-2'>{title}</p>
          <p className='text-3xl font-bold text-gray-900'>{value}</p>
          {trend && (
            <p className='text-xs text-gray-500 mt-2'>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
            </p>
          )}
        </div>
        <div className='p-3 rounded-lg bg-white/50'>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
