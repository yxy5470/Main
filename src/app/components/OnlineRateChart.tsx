import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '北京数据中心', rate: 98 },
  { name: '深圳园区', rate: 96 },
  { name: '杭州中心', rate: 94 },
  { name: '成都基地', rate: 92 },
  { name: '南京工厂', rate: 89 },
  { name: '武汉基地', rate: 85 },
  { name: '上海工厂', rate: 82 },
  { name: '广州站点', rate: 78 },
];

export function OnlineRateChart() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-medium">各项目终端在线率排行</h3>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#64748b' }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Bar
              dataKey="rate"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              name="在线率"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
