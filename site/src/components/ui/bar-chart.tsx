import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CustomBarChartProps {
  data: any[];
  xAxisKey: string;
  barKey: string;
  barFill: string;
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, xAxisKey, barKey, barFill }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey} fill={barFill} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;