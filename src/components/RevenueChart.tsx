'use client';

import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

type Props = {
  data: { date: string; revenue: number }[];
};

export default function RevenueChart({ data }: Props) {
  // Recharts expects array in chronological order (left to right)
  const chartData = [...data].reverse();

  return (
    <div className="h-24 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#64748b', fontSize: '12px' }}
            itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
            formatter={(value: number) => [`₦${value}`, 'Revenue']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4f46e5" // indigo-600
            strokeWidth={3} 
            dot={{ r: 3, fill: '#4f46e5', strokeWidth: 0 }} 
            activeDot={{ r: 5, fill: '#4338ca' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
