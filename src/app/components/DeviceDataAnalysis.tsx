import { useState } from 'react';
import { ArrowLeft, Calendar, Signal, Battery, Clock, Download } from 'lucide-react';
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

interface DeviceDataAnalysisProps {
  onBack: () => void;
}

export function DeviceDataAnalysis({ onBack }: DeviceDataAnalysisProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set(['temperature', 'humidity']));

  const toggleMetric = (metric: string) => {
    const newSet = new Set(selectedMetrics);
    if (newSet.has(metric)) {
      newSet.delete(metric);
    } else {
      newSet.add(metric);
    }
    setSelectedMetrics(newSet);
  };

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      ...(selectedMetrics.has('temperature') ? [{
        label: '温度 (℃)',
        data: [22.3, 21.8, 23.5, 26.2, 28.1, 25.4, 23.7],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointHoverBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y',
      }] : []),
      ...(selectedMetrics.has('humidity') ? [{
        label: '湿度 (%)',
        data: [65, 68, 62, 58, 55, 60, 64],
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#f97316',
        pointHoverBackgroundColor: '#f97316',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y1',
      }] : []),
      ...(selectedMetrics.has('waterlevel') ? [{
        label: '水位 (m)',
        data: [2.1, 2.3, 2.5, 2.4, 2.6, 2.8, 2.7],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#10b981',
        pointHoverBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y2',
      }] : []),
      ...(selectedMetrics.has('flow') ? [{
        label: '流量 (m³/s)',
        data: [15.2, 16.8, 18.3, 17.5, 19.2, 20.1, 18.9],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6',
        pointHoverBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointHoverBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y3',
      }] : []),
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e5e7eb',
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear',
        display: selectedMetrics.has('temperature'),
        position: 'left',
        grid: {
          color: '#e5e7eb',
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#3b82f6',
          font: {
            size: 12,
          },
        },
        title: {
          display: selectedMetrics.has('temperature'),
          text: '温度 (℃)',
          color: '#3b82f6',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y1: {
        type: 'linear',
        display: selectedMetrics.has('humidity'),
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#f97316',
          font: {
            size: 12,
          },
        },
        title: {
          display: selectedMetrics.has('humidity'),
          text: '湿度 (%)',
          color: '#f97316',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y2: {
        type: 'linear',
        display: selectedMetrics.has('waterlevel'),
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#10b981',
          font: {
            size: 12,
          },
        },
        title: {
          display: selectedMetrics.has('waterlevel'),
          text: '水位 (m)',
          color: '#10b981',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
      y3: {
        type: 'linear',
        display: selectedMetrics.has('flow'),
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#8b5cf6',
          font: {
            size: 12,
          },
        },
        title: {
          display: selectedMetrics.has('flow'),
          text: '流量 (m³/s)',
          color: '#8b5cf6',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
  };

  const historyData = [
    { time: '2024-05-26 10:45:22', temp: '26.2', humidity: '58', waterlevel: '2.4', signal: '优', raw: 'AT+SEND=26.2,58,2.4...' },
    { time: '2024-05-26 10:30:15', temp: '25.8', humidity: '60', waterlevel: '2.5', signal: '优', raw: 'AT+SEND=25.8,60,2.5...' },
    { time: '2024-05-26 10:15:08', temp: '25.1', humidity: '62', waterlevel: '2.3', signal: '良', raw: 'AT+SEND=25.1,62,2.3...' },
  ];

  return (
    <div className="size-full bg-[#F3F4F6] overflow-auto px-8 py-6">
      {/* 顶部导航与设备信息 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回设备列表</span>
          </button>
          <h1 className="text-xl font-semibold text-slate-800">数据分析：设备 SN-1024</h1>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-slate-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent">
            <option>快速切换设备</option>
            <option>SN-1024 德阳文庙监测点</option>
            <option>SN-1025 空港水厂取水</option>
            <option>SN-1026 观测场气象监测</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700">最近 7 天</span>
          </button>
        </div>
      </div>

      {/* 第一排：实时状态与属性卡片 */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* 卡片1：基础信息 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-[#3B82F6] rounded"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900">运行正常</div>
              <div className="text-xs text-slate-500 mt-1">项目：四川水利</div>
            </div>
          </div>
        </div>

        {/* 卡片2：网络状态 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1">当前信号强度</div>
              <div className="text-2xl font-semibold text-slate-900">优</div>
              <div className="text-xs text-slate-500 mt-1">-65 dBm</div>
            </div>
            <Signal className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* 卡片3：电源状态 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1">剩余电量</div>
              <div className="text-2xl font-semibold text-slate-900">87%</div>
            </div>
            <Battery className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* 卡片4：最新采集快照 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-1">最新上报时间</div>
              <div className="text-2xl font-semibold text-slate-900">10:45:22</div>
              <div className="text-xs text-slate-500 mt-1">距离上次心跳 3 分钟</div>
            </div>
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* 第二排：核心数据趋势分析图表 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">历史趋势分析</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleMetric('temperature')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('temperature')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selectedMetrics.has('temperature') ? '☑' : '☐'} 温度 (℃)
            </button>
            <button
              onClick={() => toggleMetric('humidity')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('humidity')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selectedMetrics.has('humidity') ? '☑' : '☐'} 湿度 (%)
            </button>
            <button
              onClick={() => toggleMetric('waterlevel')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('waterlevel')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selectedMetrics.has('waterlevel') ? '☑' : '☐'} 水位 (m)
            </button>
            <button
              onClick={() => toggleMetric('flow')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('flow')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {selectedMetrics.has('flow') ? '☑' : '☐'} 流量 (m³/s)
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4" style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 底部：历史数据日志表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">数据上报日志</h3>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded text-sm text-slate-700 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>导出数据</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">上报时间</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">温度(℃)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">湿度(%)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">水位(m)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">信号状态</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700">原始报文</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-900">{row.time}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.temp}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.humidity}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.waterlevel}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${row.signal === '优' ? 'text-green-600' : 'text-blue-600'}`}>
                      {row.signal}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">{row.raw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
