import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import AnalyticsChart from '../components/AnalyticsChart.jsx'; // FIX: Added .jsx extension

const API_BASE_URL = 'http://localhost:8000'; 

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/analytics`);
        setData(response.data);
      } catch (error) {
        console.error('Analytics Fetch Error:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = useMemo(() => {
    if (!data) return { topCategories: [], avgPrice: [], brandDistribution: [] };

    // Prepare data for the pie chart
    const topCategories = data.top_categories.map(c => ({ 
      name: c.name.split(' ').slice(0, 3).join(' ') + (c.name.split(' ').length > 3 ? '...' : ''), 
      value: c.count 
    }));
    
    // Prepare data for the bar chart
    const avgPrice = Object.keys(data.avg_price_by_material).map(key => ({
      material: key,
      avgPrice: data.avg_price_by_material[key],
    }));
    
    // Prepare data for supplementary stats
    const brandDistribution = data.brand_distribution.map(b => ({ name: b.brand, count: b.count }));

    return { topCategories, avgPrice, brandDistribution };
  }, [data]);
  
  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading Analytics Dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-600 font-semibold">Could not load analytics data. Is the FastAPI backend running?</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Dataset Analytics Dashboard</h2>
      
      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <p className="text-sm font-medium text-gray-500">Total Products Indexed</p>
          <p className="text-4xl font-extrabold text-indigo-700">{data.total_products.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500">
          <p className="text-sm font-medium text-gray-500">Top Brand</p>
          <p className="text-2xl font-extrabold text-teal-700">{chartData.brandDistribution[0]?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">({chartData.brandDistribution[0]?.count.toLocaleString()} products)</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <AnalyticsChart
          title="Top Categories by Product Count"
          type="pie"
          data={chartData.topCategories}
          dataKey="value"
          nameKey="name"
        />
        
        <AnalyticsChart 
          title="Average Price by Primary Material"
          type="bar"
          data={chartData.avgPrice}
          dataKey="avgPrice"
          nameKey="material"
          yAxisFormatter={(value) => `$${value}`}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
