import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartData = {
  labels: [
    '金堂水厂流量监测',
    '渠县闸门项目',
    '威远河口灌区',
    '空港水厂取水',
    '都江堰轨道交通',
    '唐源电气2026',
    '观测场',
    '德阳文庙项目',
  ],
  datasets: [
    {
      label: '告警次数',
      data: [187, 156, 142, 98, 76, 54, 32, 18],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      barThickness: 20,
    },
  ],
};

const options: ChartOptions<'bar'> = {
  indexAxis: 'y',
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
        label: (context) => `告警次数: ${context.parsed.x} 次`,
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
        display: false,
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

export function AlertFrequencyChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold">各项目告警频次排行</h3>
      </div>

      <div className="px-6 pb-6 pt-4" style={{ height: 'calc(100% - 60px)' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
