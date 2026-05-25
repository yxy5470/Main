import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'warning' | 'danger';
  showTrendBadge?: boolean;
}

export function StatCard({ title, value, trend, variant = 'default', showTrendBadge = false }: StatCardProps) {
  const valueColor = variant === 'danger' ? 'text-red-600' : variant === 'warning' ? 'text-orange-500' : 'text-foreground';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="text-sm text-muted-foreground mb-3">{title}</div>
      <div className={`text-3xl font-semibold ${valueColor} mb-2`}>
        {value}
      </div>
      {trend && showTrendBadge && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
          trend.isPositive
            ? 'bg-red-50 text-red-600'
            : 'bg-green-50 text-green-600'
        }`}>
          {trend.isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
        </div>
      )}
    </div>
  );
}
