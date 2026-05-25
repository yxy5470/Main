import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '05-19', value: 2845 },
  { date: '05-20', value: 3124 },
  { date: '05-21', value: 2967 },
  { date: '05-22', value: 3456 },
  { date: '05-23', value: 3812 },
  { date: '05-24', value: 3654 },
  { date: '05-25', value: 4021 },
];

export function DataTrendChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">近 7 天数据采集量趋势</h3>
      </div>

      <div className="px-6 pb-6 pt-4 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 13, fill: '#64748b' }}
            />
            <YAxis
              tick={{ fontSize: 13, fill: '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '14px',
                padding: '12px'
              }}
              formatter={(value: number) => [`${value.toLocaleString()} 条`, '采集量']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
