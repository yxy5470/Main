import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartData = {
  labels: ['05-19', '05-20', '05-21', '05-22', '05-23', '05-24', '05-25'],
  datasets: [
    {
      label: '采集量',
      data: [2845, 3124, 2967, 3456, 3812, 3654, 4021],
      borderColor: '#3b82f6',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        return gradient;
      },
      borderWidth: 2.5,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#3b82f6',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
    },
  ],
};

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#1f2937',
      bodyColor: '#1f2937',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: (context) => `采集量: ${context.parsed.y.toLocaleString()} 条`,
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: '#e2e8f0',
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 13,
        },
      },
    },
    y: {
      grid: {
        color: '#e2e8f0',
        drawTicks: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 13,
        },
      },
    },
  },
};

export function DataTrendChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold">近 7 天数据采集量趋势</h3>
      </div>

      <div className="px-6 pb-6 pt-4" style={{ height: 'calc(100% - 60px)' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
