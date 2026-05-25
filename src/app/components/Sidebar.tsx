import { Home, Layers, Activity, Settings, Bell, FolderOpen } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#1E293B] flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">IoT Platform</h2>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white"
          >
            <Home className="w-5 h-5" />
            <span className="text-base">首页</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-base">项目管理</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Layers className="w-5 h-5" />
            <span className="text-base">设备监控</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Activity className="w-5 h-5" />
            <span className="text-base">数据分析</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="text-base">告警中心</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="text-base">系统设置</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}
