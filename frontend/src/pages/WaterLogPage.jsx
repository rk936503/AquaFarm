import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWaterUsage } from '../slices/waterUsageSlice';
import { Button, Input, Select, Textarea } from '../components/FormElements';
import Alert from '../components/Alert';

const WaterLogPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.waterUsage);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    source: 'borewell',
    usageAmount: '',
    date: new Date().toISOString().split('T')[0],
    cropType: 'rice',
    areaIrrigated: '',
    notes: '',
    weatherCondition: 'sunny',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(addWaterUsage(formData));
    if (result.payload) {
      setShowSuccess(true);
      setFormData({
        source: 'borewell',
        usageAmount: '',
        date: new Date().toISOString().split('T')[0],
        cropType: 'rice',
        areaIrrigated: '',
        notes: '',
        weatherCondition: 'sunny',
      });
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-2'>Water Usage Log</h1>
      <p className='text-gray-600 mb-8'>Record your daily water usage and irrigation details</p>

      {showSuccess && (
        <Alert type='success' message='Water usage logged successfully!' />
      )}
      {error && <Alert type='error' message={error} />}

      <div className='max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Select
              name='source'
              label='Water Source'
              value={formData.source}
              onChange={handleChange}
              required
            >
              <option value='borewell'>Borewell</option>
              <option value='canal'>Canal</option>
              <option value='rain'>Rainwater</option>
              <option value='well'>Well</option>
              <option value='other'>Other</option>
            </Select>

            <Input
              type='number'
              name='usageAmount'
              label='Usage Amount (Liters)'
              placeholder='5000'
              required
              min='1'
              value={formData.usageAmount}
              onChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='date'
              name='date'
              label='Date'
              value={formData.date}
              onChange={handleChange}
              required
            />

            <Select
              name='cropType'
              label='Crop Type'
              value={formData.cropType}
              onChange={handleChange}
              required
            >
              <option value='rice'>Rice</option>
              <option value='wheat'>Wheat</option>
              <option value='sugarcane'>Sugarcane</option>
              <option value='cotton'>Cotton</option>
              <option value='maize'>Maize</option>
              <option value='vegetables'>Vegetables</option>
              <option value='fruits'>Fruits</option>
              <option value='pulses'>Pulses</option>
              <option value='oilseeds'>Oilseeds</option>
              <option value='other'>Other</option>
            </Select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='number'
              name='areaIrrigated'
              label='Area Irrigated (Acres)'
              placeholder='5'
              required
              step='0.1'
              min='0.1'
              value={formData.areaIrrigated}
              onChange={handleChange}
            />

            <Select
              name='weatherCondition'
              label='Weather Condition'
              value={formData.weatherCondition}
              onChange={handleChange}
            >
              <option value='sunny'>Sunny</option>
              <option value='cloudy'>Cloudy</option>
              <option value='rainy'>Rainy</option>
              <option value='partly_cloudy'>Partly Cloudy</option>
            </Select>
          </div>

          <Textarea
            name='notes'
            label='Notes (Optional)'
            placeholder='Add any observations...'
            value={formData.notes}
            onChange={handleChange}
            rows='4'
          />

          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? 'Logging...' : 'Log Water Usage'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WaterLogPage;
