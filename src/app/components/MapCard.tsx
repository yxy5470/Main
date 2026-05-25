export function MapCard() {
  const markers = [
    { id: 1, lat: 30, lng: 30, status: 'normal', name: '北京数据中心' },
    { id: 2, lat: 50, lng: 40, status: 'alert', name: '上海工厂' },
    { id: 3, lat: 60, lng: 70, status: 'normal', name: '深圳园区' },
    { id: 4, lat: 40, lng: 60, status: 'normal', name: '成都基地' },
    { id: 5, lat: 25, lng: 50, status: 'alert', name: '广州站点' },
    { id: 6, lat: 70, lng: 35, status: 'normal', name: '杭州中心' },
    { id: 7, lat: 45, lng: 25, status: 'normal', name: '南京工厂' },
    { id: 8, lat: 55, lng: 55, status: 'alert', name: '武汉基地' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-medium">项目态势分布</h3>
      </div>

      <div className="p-6">
        <div className="relative w-full h-[400px] bg-slate-50 rounded-lg overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e2e8f0" strokeWidth="0.2" />
              </pattern>
            </defs>

            <rect width="100" height="100" fill="#f8fafc" />
            <rect width="100" height="100" fill="url(#grid)" />

            <path
              d="M 15,30 Q 20,25 25,28 L 30,25 Q 35,27 40,30 L 45,28 Q 50,25 55,27 L 60,30 Q 65,28 70,32 L 75,30 Q 80,27 85,30"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.3"
            />

            <path
              d="M 10,40 Q 20,42 30,45 L 40,43 Q 50,46 60,44 L 70,47 Q 80,45 90,48"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="0.3"
            />

            <ellipse cx="40" cy="60" rx="8" ry="6" fill="#e0f2fe" fillOpacity="0.3" />
            <ellipse cx="65" cy="45" rx="6" ry="5" fill="#e0f2fe" fillOpacity="0.3" />

            {markers.map((marker) => (
              <g key={marker.id}>
                <circle
                  cx={marker.lng}
                  cy={marker.lat}
                  r="2.5"
                  fill={marker.status === 'alert' ? '#ef4444' : '#10b981'}
                  className="drop-shadow-md"
                  opacity="0.9"
                >
                  <animate
                    attributeName="r"
                    values="2.5;3.5;2.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={marker.lng}
                  cy={marker.lat}
                  r="1.5"
                  fill={marker.status === 'alert' ? '#fee2e2' : '#d1fae5'}
                />
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">正常运行</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">告警状态</span>
          </div>
        </div>
      </div>
    </div>
  );
}
