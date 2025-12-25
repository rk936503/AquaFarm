import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../slices/waterUsageSlice';
import StatCard from '../components/StatCard';
import Alert from '../components/Alert';
import { Droplet, AlertCircle, TrendingUp } from 'tabler-icons-react';
import { formatNumber } from '../utils/helpers';

const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.waterUsage);

  useEffect(() => {
    dispatch(fetchAnalytics({ period: 'all' }));
  }, [dispatch]);

  if (loading) {
    return <div className='text-center py-12'>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
      <p className='text-gray-600 mb-8'>Monitor your water usage and irrigation efficiency</p>

      {error && <Alert type='error' message={error} />}

      {/* Alert Cards */}
      {analytics?.alerts && analytics.alerts.length > 0 && (
        <div className='mb-8'>
          {analytics.alerts.map((alert, idx) => (
            <Alert
              key={idx}
              type={alert.level === 'critical' ? 'error' : 'warning'}
              message={alert.message}
            />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Total Usage'
          value={`${formatNumber(analytics?.totalUsage || 0)}L`}
          icon={Droplet}
          color='blue'
        />
        <StatCard
          title='Daily Average'
          value={`${formatNumber(analytics?.averageDailyUsage || 0)}L`}
          icon={TrendingUp}
          color='green'
        />
        <StatCard
          title='Today Usage'
          value={`${formatNumber(analytics?.dailyUsage || 0)}L`}
          icon={Droplet}
          color={
            (analytics?.dailyUsage || 0) > 10000
              ? 'red'
              : (analytics?.dailyUsage || 0) > 5000
              ? 'yellow'
              : 'green'
          }
        />
        <StatCard
          title='Weekly Total'
          value={`${formatNumber(analytics?.weeklyUsage || 0)}L`}
          icon={TrendingUp}
          color='green'
        />
      </div>

      {/* Suggestions */}
      {analytics?.suggestions && analytics.suggestions.length > 0 && (
        <div className='mt-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Optimization Tips</h2>
          <div className='space-y-4'>
            {analytics.suggestions.map((suggestion, idx) => (
              <div key={idx} className='card border-l-4 border-emerald-500'>
                <p className='text-sm text-gray-700'>{suggestion.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
