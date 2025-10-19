import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = ({ title, type, data, dataKey, nameKey, yAxisFormatter }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FDF'];

  const ChartComponent = type === 'bar' ? BarChart : PieChart;
  const ItemComponent = type === 'bar' ? Bar : Pie;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
          {type === 'bar' && <CartesianGrid strokeDasharray="3 3" />}
          {type === 'bar' && <XAxis dataKey={nameKey} stroke="#666" />}
          {type === 'bar' && <YAxis tickFormatter={yAxisFormatter} stroke="#666" />}
          <Tooltip formatter={(value) => type === 'bar' ? [`$${value.toFixed(2)}`, 'Avg Price'] : [value.toLocaleString(), 'Count']} />
          <Legend />
          
          <ItemComponent
            dataKey={dataKey}
            fill={type === 'bar' ? "#6366f1" : undefined}
            name={nameKey}
            {...(type === 'bar' ? { radius: [4, 4, 0, 0] } : {
              cx: "50%", cy: "50%", outerRadius: 100, labelLine: false,
              label: ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`
            })}
          >
            {type === 'pie' && data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </ItemComponent>
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
