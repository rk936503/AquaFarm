import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../slices/waterUsageSlice';
import StatCard from '../components/StatCard';
import { Droplet, TrendingUp } from 'tabler-icons-react';
import { formatNumber } from '../utils/helpers';

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.waterUsage);

  useEffect(() => {
    dispatch(fetchAnalytics({ period: 'all' }));
  }, [dispatch]);

  if (loading) {
    return <div className='text-center py-12'>Loading analytics...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Water Usage Analytics</h1>
      <p className='text-gray-600 mb-8'>Detailed breakdown of your water consumption patterns</p>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <StatCard
          title='Total Usage (All Time)'
          value={`${formatNumber(analytics?.totalUsage || 0)}L`}
          icon={Droplet}
        />
        <StatCard
          title='Monthly Usage'
          value={`${formatNumber(analytics?.monthlyUsage || 0)}L`}
          icon={TrendingUp}
        />
        <StatCard
          title='Efficiency (Avg)'
          value={`${formatNumber(analytics?.efficiency || 100)}L/acre`}
          icon={TrendingUp}
        />
      </div>

      {/* Source Breakdown */}
      {analytics?.sourceBreakdown && (
        <div className='card mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Water Source Distribution</h2>
          <div className='space-y-4'>
            {Object.entries(analytics.sourceBreakdown).map(([source, amount]) => {
              const total = analytics.totalUsage;
              const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
              return (
                <div key={source}>
                  <div className='flex justify-between mb-2'>
                    <span className='font-medium text-gray-700 capitalize'>{source}</span>
                    <span className='text-gray-600'>
                      {formatNumber(amount)}L ({percentage}%)
                    </span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-emerald-600 h-2 rounded-full'
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crop Breakdown */}
      {analytics?.cropBreakdown && (
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Usage by Crop Type</h2>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Crop</th>
                  <th className='text-right py-3 px-4 font-semibold text-gray-700'>
                    Total (Liters)
                  </th>
                  <th className='text-right py-3 px-4 font-semibold text-gray-700'>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(analytics.cropBreakdown).map(([crop, amount]) => {
                  const total = analytics.totalUsage;
                  const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
                  return (
                    <tr key={crop} className='border-b border-gray-100 hover:bg-gray-50'>
                      <td className='py-3 px-4 capitalize text-gray-700'>{crop}</td>
                      <td className='text-right py-3 px-4 text-gray-700'>
                        {formatNumber(amount)}
                      </td>
                      <td className='text-right py-3 px-4 text-gray-700'>{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
