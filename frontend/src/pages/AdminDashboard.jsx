import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSystemAnalytics } from '../slices/waterUsageSlice';
import StatCard from '../components/StatCard';
import { Users, Droplet, TrendingUp, AlertCircle } from 'tabler-icons-react';
import { formatNumber } from '../utils/helpers';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { systemAnalytics, loading, error } = useSelector((state) => state.waterUsage);

  useEffect(() => {
    dispatch(fetchSystemAnalytics());
  }, [dispatch]);

  if (loading) {
    return <div className='text-center py-12'>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Admin Dashboard</h1>
      <p className='text-gray-600 mb-8'>System overview and water usage statistics</p>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Total Farmers'
          value={systemAnalytics?.farmerCount || 0}
          icon={Users}
        />
        <StatCard
          title='Total Water Used'
          value={`${formatNumber(systemAnalytics?.totalUsage || 0)}L`}
          icon={Droplet}
          color='blue'
        />
        <StatCard
          title='Average per Farmer'
          value={`${formatNumber(systemAnalytics?.avgPerFarmer || 0)}L`}
          icon={TrendingUp}
          color='green'
        />
        <StatCard
          title='Inefficiencies'
          value={systemAnalytics?.inefficiencies?.length || 0}
          icon={AlertCircle}
          color={systemAnalytics?.inefficiencies?.length > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Source Distribution */}
      {systemAnalytics?.sourceDistribution && (
        <div className='card mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>System Water Source Distribution</h2>
          <div className='space-y-4'>
            {Object.entries(systemAnalytics.sourceDistribution).map(([source, amount]) => {
              const total = systemAnalytics.totalUsage;
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

      {/* Inefficiencies */}
      {systemAnalytics?.inefficiencies && systemAnalytics.inefficiencies.length > 0 && (
        <div className='card'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Flagged Inefficiencies</h2>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Farmer ID</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Issue</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Severity</th>
                </tr>
              </thead>
              <tbody>
                {systemAnalytics.inefficiencies.map((ineff, idx) => (
                  <tr key={idx} className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='py-3 px-4 text-gray-700'>{ineff.farmerId}</td>
                    <td className='py-3 px-4 text-gray-700'>{ineff.issue}</td>
                    <td className='py-3 px-4'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ineff.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {ineff.severity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
