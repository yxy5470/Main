import { useState, type ReactNode } from 'react';
import {
  Home, Layers, Activity, Settings, Bell, FolderOpen,
  ChevronDown, ChevronRight, AlertCircle, Users, Shield,
  Cpu, Database, Megaphone, FileText, ClipboardList, MessageSquare, ListTree, BellRing,
} from 'lucide-react';

type Page = 'home' | 'projects' | 'devices' | 'analysis' | 'alarm-center' | 'alarm-rules' | 'alarm-notification' | 'user-management' | 'role-management' | 'device-type' | 'data-type' | 'notice' | 'login-log' | 'op-log' | 'feedback';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const SYSTEM_SUB: { icon: ReactNode; label: string; page?: Page }[] = [
  { icon: <Users className="w-4 h-4 flex-shrink-0" />,         label: '用户管理', page: 'user-management' },
  { icon: <Shield className="w-4 h-4 flex-shrink-0" />,        label: '角色管理', page: 'role-management' },
  { icon: <Cpu className="w-4 h-4 flex-shrink-0" />,           label: '设备类型', page: 'device-type' },
  { icon: <Database className="w-4 h-4 flex-shrink-0" />,      label: '数据类型', page: 'data-type' },
  { icon: <Megaphone className="w-4 h-4 flex-shrink-0" />,     label: '通知公告', page: 'notice' },
  { icon: <FileText className="w-4 h-4 flex-shrink-0" />,      label: '登录日志', page: 'login-log' },
  { icon: <ClipboardList className="w-4 h-4 flex-shrink-0" />, label: '操作日志', page: 'op-log' },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [alarmExpanded, setAlarmExpanded]   = useState(
    currentPage === 'alarm-center' || currentPage === 'alarm-rules' || currentPage === 'alarm-notification'
  );
  const [systemExpanded, setSystemExpanded] = useState(
    currentPage === 'user-management' || currentPage === 'role-management' ||
    currentPage === 'device-type' || currentPage === 'data-type' || currentPage === 'notice' ||
    currentPage === 'login-log' || currentPage === 'op-log'
  );

  const isAlarmActive = currentPage === 'alarm-center' || currentPage === 'alarm-rules' || currentPage === 'alarm-notification';

  return (
    <aside className="w-64 bg-[#1E293B] flex flex-col h-full flex-shrink-0">
      <div className="px-6 py-5 border-b border-slate-700">
        <h2 className="text-xl font-semibold text-white">物联网监测管理平台</h2>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          {/* 1. 首页 */}
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="首页"
            active={currentPage === 'home'}
            onClick={() => onNavigate('home')}
          />

          {/* 2. 监测数据与分析 */}
          <NavItem
            icon={<Activity className="w-5 h-5" />}
            label="监测数据与分析"
            active={currentPage === 'analysis'}
            onClick={() => onNavigate('analysis')}
          />

          {/* 3. 告警中心（可展开） */}
          <ExpandableNav
            icon={<Bell className="w-5 h-5 flex-shrink-0" />}
            label="告警中心"
            expanded={alarmExpanded}
            parentActive={isAlarmActive}
            onToggle={() => setAlarmExpanded(v => !v)}
          >
            <SubItem
              icon={<AlertCircle className="w-4 h-4 flex-shrink-0" />}
              label="告警处理台"
              active={currentPage === 'alarm-center'}
              onClick={() => onNavigate('alarm-center')}
            />
            <SubItem
              icon={<ListTree className="w-4 h-4 flex-shrink-0" />}
              label="告警规则"
              active={currentPage === 'alarm-rules'}
              onClick={() => onNavigate('alarm-rules')}
            />
            <SubItem
              icon={<BellRing className="w-4 h-4 flex-shrink-0" />}
              label="告警通知管理"
              active={currentPage === 'alarm-notification'}
              onClick={() => onNavigate('alarm-notification')}
            />
          </ExpandableNav>

          {/* 4. 设备管理 */}
          <NavItem
            icon={<Layers className="w-5 h-5" />}
            label="设备管理"
            active={currentPage === 'devices'}
            onClick={() => onNavigate('devices')}
          />

          {/* 5. 项目管理 */}
          <NavItem
            icon={<FolderOpen className="w-5 h-5" />}
            label="项目管理"
            active={currentPage === 'projects'}
            onClick={() => onNavigate('projects')}
          />

          {/* 6. 系统管理（可展开） */}
          <ExpandableNav
            icon={<Settings className="w-5 h-5 flex-shrink-0" />}
            label="系统管理"
            expanded={systemExpanded}
            parentActive={false}
            onToggle={() => setSystemExpanded(v => !v)}
          >
            {SYSTEM_SUB.map(({ icon, label, page }) => (
              <SubItem key={label} icon={icon} label={label}
                active={!!page && currentPage === page}
                onClick={() => page && onNavigate(page)} />
            ))}
          </ExpandableNav>

          {/* 7. 问题反馈 */}
          <NavItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="问题反馈"
            active={currentPage === 'feedback'}
            onClick={() => onNavigate('feedback')}
          />
        </div>
      </nav>
    </aside>
  );
}

/* ─── shared nav primitives ─── */

function NavItem({
  icon, label, active, onClick,
}: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
        ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
    >
      {icon}
      <span className="text-base">{label}</span>
    </button>
  );
}

function ExpandableNav({
  icon, label, expanded, parentActive, onToggle, children,
}: {
  icon: ReactNode; label: string; expanded: boolean;
  parentActive: boolean; onToggle: () => void; children: ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${parentActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
      >
        {icon}
        <span className="text-base flex-1 text-left">{label}</span>
        {expanded
          ? <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-60" />
          : <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-60" />}
      </button>
      {expanded && (
        <div className="mt-1 ml-4 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

function SubItem({
  icon, label, active, onClick,
}: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 pl-6 pr-4 py-2.5 rounded-lg text-sm transition-colors
        ${active
          ? 'bg-blue-500 text-white font-medium'
          : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
    >
      {icon}
      {label}
    </button>
  );
}
