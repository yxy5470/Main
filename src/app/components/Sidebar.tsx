import { Home, Layers, Activity, Settings, Bell, FolderOpen } from 'lucide-react';

interface SidebarProps {
  currentPage: 'home' | 'projects' | 'devices' | 'analysis';
  onNavigate: (page: 'home' | 'projects' | 'devices' | 'analysis') => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1E293B] flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">物联网监测管理平台</h2>
      </div>

      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {/* 1. 首页 */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-base">首页</span>
          </a>

          {/* 2. 监测数据与分析 */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('analysis');
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'analysis'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-base">监测数据与分析</span>
          </a>

          {/* 3. 告警中心 */}
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="text-base">告警中心</span>
          </a>

          {/* 4. 设备管理 */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('devices');
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'devices'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-base">设备管理</span>
          </a>

          {/* 5. 项目管理 */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('projects');
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-base">项目管理</span>
          </a>

          {/* 6. 系统设置 */}
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
