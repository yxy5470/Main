import { Plus, Minus, MapPin } from 'lucide-react';

export function MapCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative" style={{ height: 'calc(100vh - 280px)' }}>
      {/* 地图背景层 - 模拟浅色科技风格地图 */}
      <div className="absolute inset-0 bg-[#E8EDF2]">
        {/* 模拟水系 */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <path
            d="M 100 300 Q 200 250 400 280 T 800 300 L 800 400 L 100 400 Z"
            fill="#A3D5FF"
            opacity="0.4"
          />
          <path
            d="M 500 100 Q 600 120 700 100 T 900 110 L 900 200 L 500 180 Z"
            fill="#A3D5FF"
            opacity="0.3"
          />
        </svg>

        {/* 模拟路网 */}
        <svg className="absolute inset-0 w-full h-full">
          {/* 水平道路 */}
          <line x1="0" y1="200" x2="100%" y2="200" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="400" x2="100%" y2="400" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
          <line x1="0" y1="600" x2="100%" y2="600" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />

          {/* 垂直道路 */}
          <line x1="300" y1="0" x2="300" y2="100%" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
          <line x1="600" y1="0" x2="600" y2="100%" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
          <line x1="900" y1="0" x2="900" y2="100%" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
          <line x1="1200" y1="0" x2="1200" y2="100%" stroke="#C5CAD1" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* 网格纹理 */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(197, 202, 209, 0.05) 25%, rgba(197, 202, 209, 0.05) 26%, transparent 27%, transparent 74%, rgba(197, 202, 209, 0.05) 75%, rgba(197, 202, 209, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(197, 202, 209, 0.05) 25%, rgba(197, 202, 209, 0.05) 26%, transparent 27%, transparent 74%, rgba(197, 202, 209, 0.05) 75%, rgba(197, 202, 209, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* 点聚合标记 - 左侧 */}
      <div className="absolute" style={{ left: '20%', top: '35%' }}>
        <div className="relative">
          {/* 光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" style={{ width: '60px', height: '60px', top: '-10px', left: '-10px' }}></div>

          {/* 聚合圆圈 */}
          <div className="relative w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-semibold text-sm">12</span>
          </div>
        </div>
      </div>

      {/* 点聚合标记 - 右上角 */}
      <div className="absolute" style={{ right: '15%', top: '20%' }}>
        <div className="relative">
          {/* 光晕效果 */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping" style={{ width: '70px', height: '70px', top: '-15px', left: '-15px' }}></div>

          {/* 聚合圆圈 */}
          <div className="relative w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span className="text-white font-semibold text-base">45</span>
          </div>
        </div>
      </div>

      {/* 中心定位图钉和信息面板 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* 信息弹窗 - 在图钉上方 */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[280px]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">监测点位名称：</span>
                <span className="text-slate-900 font-medium">观测场1号</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">S/N：</span>
                <span className="text-slate-900 font-medium">CR120251120001</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">TNS/IMEI：</span>
                <span className="text-slate-900 font-medium">868381079719402</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">定位方式：</span>
                <span className="text-slate-900 font-medium">自动定位</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">经度：</span>
                <span className="text-slate-900 font-medium">103.990207</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">纬度：</span>
                <span className="text-slate-900 font-medium">30.774069</span>
              </div>
            </div>

            {/* 弹窗小箭头 */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* 红色图钉 */}
        <div className="relative">
          <MapPin className="w-10 h-10 text-red-500 fill-red-500 drop-shadow-lg" />
        </div>
      </div>

      {/* 缩放控件 - 右下角 */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-1 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors border-b border-slate-200">
          <Plus className="w-5 h-5 text-slate-700" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <Minus className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* 地图图例/标签 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
          <span>设备点位聚合</span>
        </div>
      </div>
    </div>
  );
}
