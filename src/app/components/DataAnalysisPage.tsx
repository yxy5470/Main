import { useState } from 'react';
import { Calendar, Download, X, ChevronDown } from 'lucide-react';
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
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function DataAnalysisPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(['temperature', 'humidity'])
  );
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['SN-1024', 'SN-1025']);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const toggleMetric = (metric: string) => {
    const newSet = new Set(selectedMetrics);
    if (newSet.has(metric)) {
      newSet.delete(metric);
    } else {
      newSet.add(metric);
    }
    setSelectedMetrics(newSet);
  };

  const removeDevice = (device: string) => {
    setSelectedDevices(selectedDevices.filter((d) => d !== device));
  };

  const chartData = {
    labels: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06', '10-07'],
    datasets: [
      ...(selectedMetrics.has('temperature')
        ? [
            {
              label: '温度 (℃)',
              data: [22, 24, 26, 28, 27, 25, 23],
              borderColor: '#f97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#f97316',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              yAxisID: 'y',
            },
          ]
        : []),
      ...(selectedMetrics.has('humidity')
        ? [
            {
              label: '湿度 (%)',
              data: [65, 62, 68, 70, 66, 64, 67],
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              yAxisID: 'y1',
            },
          ]
        : []),
      ...(selectedMetrics.has('waterlevel')
        ? [
            {
              label: '水位 (m)',
              data: [2.1, 2.3, 2.5, 2.4, 2.6, 2.5, 2.7],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#10b981',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              yAxisID: 'y2',
            },
          ]
        : []),
      ...(selectedMetrics.has('voltage')
        ? [
            {
              label: '电池电压 (V)',
              data: [12.8, 12.6, 12.5, 12.4, 12.3, 12.2, 12.1],
              borderColor: '#8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderWidth: 2.5,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: '#8b5cf6',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              yAxisID: 'y3',
            },
          ]
        : []),
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
          padding: 20,
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
        min: 0,
        max: 100,
        grid: {
          color: '#e5e7eb',
          drawTicks: false,
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
          display: selectedMetrics.has('temperature'),
          text: '温度 (℃)',
          color: '#f97316',
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
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#3b82f6',
          font: {
            size: 12,
          },
          callback: (value) => `${value}%`,
        },
        title: {
          display: selectedMetrics.has('humidity'),
          text: '湿度 (%)',
          color: '#3b82f6',
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
        display: selectedMetrics.has('voltage'),
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
          display: selectedMetrics.has('voltage'),
          text: '电池电压 (V)',
          color: '#8b5cf6',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
  };

  const tableData = [
    { time: '2023-10-07 14:30:00', sn: 'SN-1024', temp: '23.5', humidity: '67' },
    { time: '2023-10-07 14:15:00', sn: 'SN-1025', temp: '24.2', humidity: '65' },
    { time: '2023-10-07 14:00:00', sn: 'SN-1024', temp: '23.8', humidity: '66' },
  ];

  const totalItems = 520;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex-1 overflow-auto px-8 py-6">
      {/* 顶部模块：全局分析条件选择器 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* 所属项目 */}
          <div className="flex-shrink-0">
            <select className="px-4 py-2 border border-slate-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent min-w-[180px]">
              <option>四川水利项目</option>
              <option>广东气象项目</option>
              <option>环境监测系统</option>
            </select>
          </div>

          {/* 选择设备（多选） */}
          <div className="flex-1 relative">
            <div className="px-4 py-2 border border-slate-300 rounded bg-white text-sm min-h-[40px] flex items-center flex-wrap gap-2">
              {selectedDevices.length === 0 ? (
                <span className="text-slate-400">选择设备</span>
              ) : (
                selectedDevices.map((device) => (
                  <span
                    key={device}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                  >
                    {device}
                    <button
                      onClick={() => removeDevice(device)}
                      className="hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
              <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
            </div>
          </div>

          {/* 时间范围 */}
          <div className="flex-shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded bg-white text-sm hover:bg-slate-50 transition-colors min-w-[240px]">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-slate-700">2023-10-01 至 2023-10-07</span>
            </button>
          </div>

          {/* 操作按钮 */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <button className="px-6 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium">
              生成分析
            </button>
            <button className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium">
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 中间模块：多指标选择与对比图表 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">对比分析图表</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleMetric('temperature')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('temperature')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {selectedMetrics.has('temperature') ? '☑' : '☐'} 温度 (℃)
            </button>
            <button
              onClick={() => toggleMetric('humidity')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('humidity')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {selectedMetrics.has('humidity') ? '☑' : '☐'} 湿度 (%)
            </button>
            <button
              onClick={() => toggleMetric('waterlevel')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('waterlevel')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {selectedMetrics.has('waterlevel') ? '☐' : '☐'} 水位 (m)
            </button>
            <button
              onClick={() => toggleMetric('voltage')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.has('voltage')
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {selectedMetrics.has('voltage') ? '☐' : '☐'} 电池电压 (V)
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4" style={{ height: '500px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 底部模块：聚合数据明细表 */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">数据明细</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4" />
            <span>导出 Excel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">时间</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">设备 S/N</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">温度 (℃)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">湿度 (%)</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  style={{ height: '50px' }}
                >
                  <td className="px-6 py-4 text-sm text-slate-900">{row.time}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.sn}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.temp}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.humidity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页器 */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">共 {totalItems} 条</div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === page
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-2 text-slate-400">...</span>

            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === totalPages
                  ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                  : 'border-slate-300 hover:bg-slate-50'
              }`}
            >
              {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
