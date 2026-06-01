import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { ProjectTable } from './components/ProjectTable';
import { AlertList } from './components/AlertList';
import { MapCard } from './components/MapCard';
import { ProjectManagement } from './components/ProjectManagement';
import { DeviceManagement } from './components/DeviceManagement';
import { DataAnalysisPage } from './components/DataAnalysisPage';
import { AlarmCenter } from './components/AlarmCenter';
import { UserManagement } from './components/UserManagement';
import { RoleManagement } from './components/RoleManagement';
import { DeviceTypeManagement } from './components/DeviceTypeManagement';
import { DataTypeManagement } from './components/DataTypeManagement';
import { NoticeManagement } from './components/NoticeManagement';
import { LoginLog } from './components/LoginLog';
import { OperationLog } from './components/OperationLog';
import { FeedbackManagement } from './components/FeedbackManagement';

type Page = 'home' | 'projects' | 'devices' | 'analysis' | 'alarm-center' | 'user-management' | 'role-management' | 'device-type' | 'data-type' | 'notice' | 'login-log' | 'op-log' | 'feedback';

const PAGE_BREADCRUMBS: Record<Page, { label: string }[]> = {
  'home': [{ label: '首页' }],
  'projects': [{ label: '首页' }, { label: '项目管理' }],
  'devices': [{ label: '首页' }, { label: '设备管理' }],
  'analysis': [{ label: '首页' }, { label: '监测数据与分析' }],
  'alarm-center': [{ label: '首页' }, { label: '告警中心' }],
  'user-management': [{ label: '首页' }, { label: '系统管理' }, { label: '用户管理' }],
  'role-management': [{ label: '首页' }, { label: '系统管理' }, { label: '角色管理' }],
  'device-type': [{ label: '首页' }, { label: '系统管理' }, { label: '设备类型管理' }],
  'data-type': [{ label: '首页' }, { label: '系统管理' }, { label: '数据类型管理' }],
  'notice': [{ label: '首页' }, { label: '系统管理' }, { label: '通知公告' }],
  'login-log': [{ label: '首页' }, { label: '系统管理' }, { label: '登录日志' }],
  'op-log': [{ label: '首页' }, { label: '系统管理' }, { label: '操作日志' }],
  'feedback': [{ label: '首页' }, { label: '系统管理' }, { label: '问题反馈' }],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="size-full flex bg-[#F3F4F6]">
      <Sidebar currentPage={currentPage} onNavigate={(p) => setCurrentPage(p as Page)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header breadcrumbs={PAGE_BREADCRUMBS[currentPage]} />

        {currentPage === 'home' && (
          <main className="flex-1 overflow-auto px-8 py-6">
            <div className="grid grid-cols-4 gap-6 mb-6">
              <StatCard
                title="项目总数"
                value={68}
              />
              <StatCard
                title="接入设备总数"
                value="9,393"
              />
              <StatCard
                title="今日新增告警"
                value={127}
                variant="danger"
                trend={{ value: 12, isPositive: true }}
                showTrendBadge={true}
              />
              <StatCard
                title="离线设备数"
                value={383}
                variant="warning"
                trend={{ value: 8, isPositive: true }}
                showTrendBadge={true}
              />
            </div>

            {/* 大型地图卡片 */}
            <div className="mb-6">
              <MapCard />
            </div>

            <div className="grid grid-cols-10 gap-6 pb-6">
              <div className="col-span-7 h-[400px]">
                <ProjectTable />
              </div>
              <div className="col-span-3 h-[400px]">
                <AlertList />
              </div>
            </div>
          </main>
        )}

        {currentPage === 'projects' && <ProjectManagement />}

        {currentPage === 'devices' && <DeviceManagement />}

        {currentPage === 'analysis' && <DataAnalysisPage />}
        {currentPage === 'alarm-center' && <AlarmCenter />}
        {currentPage === 'user-management' && <UserManagement />}
        {currentPage === 'role-management' && <RoleManagement />}
        {currentPage === 'device-type' && <DeviceTypeManagement />}
        {currentPage === 'data-type' && <DataTypeManagement />}
        {currentPage === 'notice' && <NoticeManagement />}
        {currentPage === 'login-log' && <LoginLog />}
        {currentPage === 'op-log' && <OperationLog />}
        {currentPage === 'feedback' && <FeedbackManagement />}
      </div>
    </div>
  );
}