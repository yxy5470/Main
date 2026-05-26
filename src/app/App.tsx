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

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'devices' | 'analysis'>('home');

  return (
    <div className="size-full flex bg-[#F3F4F6]">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

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
      </div>
    </div>
  );
}