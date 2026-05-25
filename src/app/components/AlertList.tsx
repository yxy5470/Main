interface Alert {
  id: number;
  level: 'high' | 'medium';
  project: string;
  reason: string;
  time: string;
}

const alerts: Alert[] = [
  { id: 1, level: 'high', project: '金堂水厂流量监测项目', reason: '低电压', time: '10:23' },
  { id: 2, level: 'high', project: '渠县闸门项目', reason: '低电量', time: '10:15' },
  { id: 3, level: 'medium', project: '威远河口灌区项目', reason: '弱信号', time: '10:08' },
  { id: 4, level: 'high', project: '空港水厂取水监测项目', reason: '数据超限', time: '09:52' },
  { id: 5, level: 'medium', project: '都江堰轨道交通项目', reason: '弱信号', time: '09:45' },
  { id: 6, level: 'medium', project: '唐源电气2026项目', reason: '低电压', time: '09:32' },
  { id: 7, level: 'high', project: '金堂水厂流量监测项目', reason: '数据超限', time: '09:18' },
  { id: 8, level: 'medium', project: '德阳文庙项目', reason: '低电量', time: '09:05' },
  { id: 9, level: 'high', project: '渠县闸门项目', reason: '数据超限', time: '08:47' },
  { id: 10, level: 'medium', project: '观测场', reason: '弱信号', time: '08:35' },
  { id: 11, level: 'high', project: '酉酬项目', reason: '低电压', time: '08:21' },
  { id: 12, level: 'medium', project: '空港水厂取水监测项目', reason: '低电量', time: '08:12' },
  { id: 13, level: 'high', project: '威远河口灌区项目', reason: '数据超限', time: '07:58' },
  { id: 14, level: 'medium', project: '都江堰轨道交通项目', reason: '弱信号', time: '07:45' },
  { id: 15, level: 'high', project: '唐源电气2026项目', reason: '低电压', time: '07:32' },
];

export function AlertList() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-lg font-semibold">待处理告警</h3>
      </div>

      <div className="flex-1 overflow-y-scroll">
        <div className="divide-y divide-slate-200">
          {alerts.map((alert) => (
            <div key={alert.id} className="px-5 py-2.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  alert.level === 'high' ? 'bg-red-500' : 'bg-orange-500'
                }`} />

                <div className="flex-1 min-w-0 truncate text-sm font-medium text-foreground">
                  {alert.project}
                </div>

                <div className="flex-shrink-0 text-sm text-muted-foreground">
                  {alert.reason}
                </div>

                <div className="flex-shrink-0 text-sm text-muted-foreground w-12 text-right">
                  {alert.time}
                </div>

                <button className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium">
                  处理
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
