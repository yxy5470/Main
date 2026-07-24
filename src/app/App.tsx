import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TabBar, Tab } from './components/TabBar';
import { StatCard } from './components/StatCard';
import { ProjectTable } from './components/ProjectTable';
import { AlertList } from './components/AlertList';
import { MapCard } from './components/MapCard';
import { ProjectManagement } from './components/ProjectManagement';
import { DeviceManagement } from './components/DeviceManagement';
import { DeviceList } from './components/DeviceList';
import { TaskCenter } from './components/TaskCenter';
import { AccessModelManagement } from './components/AccessModelManagement';
import { PushModelManagement } from './components/PushModelManagement';
import { DataPush } from './components/DataPush';
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
import { AlarmRules } from './components/AlarmRules';
import { AlarmNotification } from './components/AlarmNotification';

type Page = 'home' | 'projects' | 'devices' | 'device-list' | 'task-center' | 'data-push' | 'analysis' | 'alarm-center' | 'alarm-rules' | 'alarm-notification' | 'user-management' | 'role-management' | 'device-type' | 'access-model' | 'push-model' | 'data-type' | 'notice' | 'login-log' | 'op-log' | 'feedback';

const PAGE_CONFIG: Record<Page, { label: string; breadcrumbs: { label: string }[] }> = {
  'home': { label: '首页', breadcrumbs: [{ label: '首页' }] },
  'projects': { label: '项目管理', breadcrumbs: [{ label: '首页' }, { label: '项目管理' }] },
  'devices': { label: '设备管理', breadcrumbs: [{ label: '首页' }, { label: '设备管理' }] },
  'device-list': { label: '设备列表', breadcrumbs: [{ label: '首页' }, { label: '设备管理' }, { label: '设备列表' }] },
  'task-center': { label: '任务中心', breadcrumbs: [{ label: '首页' }, { label: '设备管理' }, { label: '任务中心' }] },
  'data-push':   { label: '数据推送', breadcrumbs: [{ label: '首页' }, { label: '设备管理' }, { label: '数据推送' }] },
  'analysis': { label: '监测数据与分析', breadcrumbs: [{ label: '首页' }, { label: '监测数据与分析' }] },
  'alarm-center': { label: '告警处理台', breadcrumbs: [{ label: '首页' }, { label: '告警中心' }, { label: '告警处理台' }] },
  'alarm-rules': { label: '告警规则', breadcrumbs: [{ label: '首页' }, { label: '告警中心' }, { label: '告警规则' }] },
  'alarm-notification': { label: '告警通知管理', breadcrumbs: [{ label: '首页' }, { label: '告警中心' }, { label: '告警通知管理' }] },
  'user-management': { label: '用户管理', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '用户管理' }] },
  'role-management': { label: '角色管理', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '角色管理' }] },
  'device-type':  { label: '设备类型管理', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '设备类型管理' }] },
  'access-model': { label: '接入物模型',   breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '接入物模型' }] },
  'push-model':   { label: '推送物模型',   breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '推送物模型' }] },
  'data-type': { label: '数据类型管理', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '数据类型管理' }] },
  'notice': { label: '通知公告', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '通知公告' }] },
  'login-log': { label: '登录日志', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '登录日志' }] },
  'op-log': { label: '操作日志', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '操作日志' }] },
  'feedback': { label: '问题反馈', breadcrumbs: [{ label: '首页' }, { label: '系统管理' }, { label: '问题反馈' }] },
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [tabs, setTabs] = useState<Tab[]>([
    { key: 'home', label: '首页', closable: false }
  ]);

  const handleNavigate = (page: string) => {
    const pageKey = page as Page;
    const pageConfig = PAGE_CONFIG[pageKey];

    // 检查标签是否已存在
    setTabs(prevTabs => {
      const tabExists = prevTabs.some(tab => tab.key === pageKey);
      if (!tabExists) {
        return [...prevTabs, {
          key: pageKey,
          label: pageConfig.label,
          closable: true
        }];
      }
      return prevTabs;
    });

    setCurrentPage(pageKey);
  };

  const handleTabClick = (key: string) => {
    setCurrentPage(key as Page);
  };

  const handleTabClose = (key: string) => {
    const newTabs = tabs.filter(tab => tab.key !== key);
    setTabs(newTabs);

    // 如果关闭的是当前激活的标签，切换到最后一个标签
    if (key === currentPage) {
      const lastTab = newTabs[newTabs.length - 1];
      setCurrentPage(lastTab.key as Page);
    }
  };

  return (
    <div className="size-full flex bg-[#F3F4F6]">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header breadcrumbs={PAGE_CONFIG[currentPage].breadcrumbs} />
        <TabBar
          tabs={tabs}
          activeKey={currentPage}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
        />

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
        {currentPage === 'device-list' && <DeviceList />}
        {currentPage === 'task-center' && <TaskCenter />}
        {currentPage === 'data-push' && <DataPush />}

        {currentPage === 'analysis' && <DataAnalysisPage />}
        {currentPage === 'alarm-center' && <AlarmCenter />}
        {currentPage === 'alarm-rules' && <AlarmRules />}
        {currentPage === 'alarm-notification' && <AlarmNotification />}
        {currentPage === 'user-management' && <UserManagement />}
        {currentPage === 'role-management' && <RoleManagement />}
        {currentPage === 'device-type' && <DeviceTypeManagement />}
        {currentPage === 'access-model' && <AccessModelManagement />}
        {currentPage === 'push-model' && <PushModelManagement />}
        {currentPage === 'data-type' && <DataTypeManagement />}
        {currentPage === 'notice' && <NoticeManagement />}
        {currentPage === 'login-log' && <LoginLog />}
        {currentPage === 'op-log' && <OperationLog />}
        {currentPage === 'feedback' && <FeedbackManagement />}
      </div>
    </div>
  );
}