'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DATA = [
  { day: 'Mon', revenue: 42000 },
  { day: 'Tue', revenue: 51000 },
  { day: 'Wed', revenue: 47500 },
  { day: 'Thu', revenue: 61200 },
  { day: 'Fri', revenue: 58900 },
  { day: 'Sat', revenue: 72300 },
  { day: 'Sun', revenue: 68100 },
];

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={DATA}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
        <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
        <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
