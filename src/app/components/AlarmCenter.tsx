import { useState } from 'react';
import {
  Bell, Search, Download, ChevronDown, AlertTriangle,
  BarChart2, Settings, MoreHorizontal, CheckSquare, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ─────────────────── types ─────────────────── */
type AlarmLevel = 'red' | 'orange' | 'yellow' | 'blue' | 'info';
type AlarmStatus = 'pending' | 'resolved';

interface AlarmRow {
  id: number;
  time: string;
  level: AlarmLevel;
  device: string;
  dataType: string;
  content: string;
  duration: string;
  status: AlarmStatus;
  resolved: boolean;
}

/* ─────────────────── mock data ─────────────────── */
const ALARMS: AlarmRow[] = [
  {
    id: 1, time: '2026-05-25 14:23:05', level: 'red',
    device: '主干渠1号', dataType: '水位', content: '数据超限',
    duration: '10分钟', status: 'pending', resolved: false,
  },
  {
    id: 2, time: '2026-05-25 13:10:00', level: 'orange',
    device: '蓄水池B区水泵', dataType: '', content: '设备离线',
    duration: '1小时', status: 'pending', resolved: false,
  },
  {
    id: 3, time: '2026-05-25 10:05:22', level: 'red',
    device: '温室大棚A区', dataType: '温度', content: '数据超限',
    duration: '35分钟', status: 'pending', resolved: false,
  },
  {
    id: 4, time: '2026-05-24 09:00:00', level: 'info',
    device: '2号配电箱', dataType: '电压', content: '低电压',
    duration: '—', status: 'resolved', resolved: true,
  },
];

/* ─────────────────── level badge ─────────────────── */
const LEVEL_CFG: Record<AlarmLevel, { label: string; dot: string; text: string; bg: string; border: string }> = {
  red:    { label: '红色', dot: '#F5222D', text: '#CF1322', bg: '#FFF1F0', border: '#FFA39E' },
  orange: { label: '橙色', dot: '#FA8C16', text: '#AD4E00', bg: '#FFF7E6', border: '#FFD591' },
  yellow: { label: '黄色', dot: '#FADB14', text: '#7D6608', bg: '#FEFFE6', border: '#FFFB8F' },
  blue:   { label: '蓝色', dot: '#1890FF', text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  info:   { label: '提示', dot: '#8C8C8C', text: '#595959', bg: '#F5F5F5', border: '#D9D9D9' },
};

function LevelTag({ level }: { level: AlarmLevel }) {
  const c = LEVEL_CFG[level];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: c.text, background: c.bg, borderColor: c.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function StatusTag({ status }: { status: AlarmStatus }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
        style={{ color: '#389E0D', background: '#F6FFED', borderColor: '#B7EB8F' }}>
        ✅ 已处理
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: '#D46B08', background: '#FFF7E6', borderColor: '#FFD591' }}>
      待处理
    </span>
  );
}

/* ─────────────────── more dropdown ─────────────────── */
function MoreMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-0.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        更多 <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
          {['误报/忽略', '标记已处理', '屏蔽此告警', '调整告警规则'].map(item => (
            <button key={item}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function AlarmCenter() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openMore, setOpenMore] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL = 152;
  const TOTAL_PAGES = 8;

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(ALARMS.map(a => a.id)) : new Set());
  };

  const allChecked = ALARMS.length > 0 && selectedIds.size === ALARMS.length;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F3F4F6] overflow-auto px-6 py-5 gap-4">

      {/* ── 一、顶部数据大盘 ── */}
      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        {/* 卡片1：待处理告警 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">待处理告警</p>
            <p className="font-extrabold leading-none" style={{ fontSize: '36px', color: '#F5222D' }}>15</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#FFF1F0' }}>
            <Bell className="w-6 h-6" style={{ color: '#F5222D' }} />
          </div>
        </div>

        {/* 卡片2：今日新增 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">今日新增</p>
            <p className="font-extrabold leading-none text-slate-900" style={{ fontSize: '36px' }}>42</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* 卡片3：数据超限数 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">数据超限数</p>
            <p className="font-extrabold leading-none text-slate-400" style={{ fontSize: '36px' }}>10</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {/* 卡片4：工况告警数 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">工况告警数</p>
            <p className="font-extrabold leading-none text-slate-400" style={{ fontSize: '36px' }}>5</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Settings className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── 二、筛选区 ── */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-4 flex-shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 告警状态 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">告警状态</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-9 px-3 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              style={{
                borderColor: statusFilter === 'pending' ? '#1890FF' : '#D9D9D9',
                color: statusFilter === 'pending' ? '#1890FF' : '#595959',
                minWidth: '108px',
              }}
            >
              <option value="pending">待处理</option>
              <option value="resolved">已处理</option>
              <option value="all">全部</option>
            </select>
          </div>

          {/* 告警等级 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">告警等级</label>
            <div className="h-9 px-3 flex items-center gap-1.5 border border-slate-300 rounded text-sm text-slate-600 bg-white cursor-pointer hover:border-blue-400 transition-colors min-w-[148px]">
              <span className="flex-1 text-slate-400">红色、橙色预警</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </div>
          </div>

          {/* 告警时间 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">告警时间</label>
            <div className="h-9 px-3 flex items-center border border-slate-300 rounded text-sm text-slate-600 bg-white cursor-pointer hover:border-blue-400 transition-colors min-w-[220px] gap-2">
              <span>2026-05-20</span>
              <span className="text-slate-300">至</span>
              <span>2026-05-25</span>
            </div>
          </div>

          {/* 模糊搜索 */}
          <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
            <label className="text-xs text-slate-400">模糊搜索</label>
            <div className="h-9 flex items-center border border-slate-300 rounded bg-white hover:border-blue-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="请输入监测点位名称、S/N或IMEI"
                className="flex-1 px-2 text-sm bg-transparent focus:outline-none placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* 告警内容 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">告警内容</label>
            <div className="h-9 px-3 flex items-center gap-1.5 border border-slate-300 rounded text-sm text-slate-600 bg-white cursor-pointer hover:border-blue-400 transition-colors min-w-[140px]">
              <span className="flex-1 text-slate-400">数据超限、离线</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex items-end gap-2 pb-0" style={{ paddingTop: '19px' }}>
            <button className="h-9 px-5 bg-[#1890FF] hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors shadow-sm">
              查询
            </button>
            <button className="h-9 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded transition-colors">
              重置
            </button>
            <button className="h-9 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              导出当前数据
            </button>
          </div>
        </div>
      </div>

      {/* ── 三、数据表格 ── */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[960px] border-collapse">
            {/* 表头 */}
            <thead>
              <tr className="h-12 sticky top-0 z-10" style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                <th className="px-4 w-10 text-left">
                  <input type="checkbox" checked={allChecked} onChange={e => toggleAll(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-500" />
                </th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">
                  <span className="flex items-center gap-1">告警时间 <ChevronDown className="w-3.5 h-3.5 text-slate-400" /></span>
                </th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">告警等级</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">告警设备</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">数据类型</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">告警内容</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">持续时长</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">当前状态</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {ALARMS.map((row, idx) => {
                const isHovered = hoveredRow === row.id;
                const isOdd = idx % 2 === 1;
                const isResolved = row.resolved;

                let rowBg = 'transparent';
                if (isHovered && !isResolved) rowBg = '#E6F7FF';
                else if (isOdd) rowBg = '#FAFAFA';

                return (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      height: '56px',
                      background: rowBg,
                      borderBottom: '1px solid #F0F0F0',
                      color: isResolved ? '#999999' : undefined,
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* 复选框 */}
                    <td className="px-4">
                      <input type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4 rounded border-slate-300 accent-blue-500" />
                    </td>

                    {/* 时间 */}
                    <td className="px-4 text-sm whitespace-nowrap" style={{ color: isResolved ? '#999' : '#262626' }}>
                      {row.time}
                    </td>

                    {/* 等级 */}
                    <td className="px-4">
                      {isResolved
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                            style={{ color: '#8C8C8C', background: '#F5F5F5', borderColor: '#D9D9D9' }}>
                            提示
                          </span>
                        : <LevelTag level={row.level} />}
                    </td>

                    {/* 设备 */}
                    <td className="px-4 text-sm font-medium" style={{ color: isResolved ? '#999' : '#262626' }}>
                      {row.device}
                    </td>

                    {/* 数据类型 */}
                    <td className="px-4 text-sm" style={{ color: isResolved ? '#bbb' : '#595959' }}>
                      {row.dataType || <span className="text-slate-300">—</span>}
                    </td>

                    {/* 告警内容 */}
                    <td className="px-4">
                      <span className="text-sm" style={{ color: isResolved ? '#bbb' : '#595959' }}>
                        {row.content}
                      </span>
                    </td>

                    {/* 持续时长 */}
                    <td className="px-4 text-sm" style={{ color: isResolved ? '#bbb' : '#595959' }}>
                      {row.duration}
                    </td>

                    {/* 状态 */}
                    <td className="px-4">
                      <StatusTag status={row.status} />
                    </td>

                    {/* 操作 */}
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        {isResolved ? (
                          <button className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                            📄 查看记录
                          </button>
                        ) : (
                          <>
                            <button className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
                              style={{ color: '#1890FF' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#096DD9')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#1890FF')}>
                              <BarChart2 className="w-3.5 h-3.5" />
                              查看数据
                            </button>
                            <span className="text-slate-200">|</span>
                            <button className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                              <Settings className="w-3.5 h-3.5" />
                              管理设备
                            </button>
                            <span className="text-slate-200">|</span>
                            <MoreMenu
                              open={openMore === row.id}
                              onToggle={() => setOpenMore(openMore === row.id ? null : row.id)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── 四、底部：批量操作 + 分页 ── */}
        <div className="flex-shrink-0 px-5 h-12 border-t border-slate-100 flex items-center justify-between">
          {/* 批量操作 */}
          <button
            disabled={selectedIds.size === 0}
            className="inline-flex items-center gap-1.5 h-8 px-4 text-sm rounded border transition-colors"
            style={{
              borderColor: selectedIds.size > 0 ? '#D9D9D9' : '#F0F0F0',
              color: selectedIds.size > 0 ? '#595959' : '#BFBFBF',
              background: selectedIds.size > 0 ? '#fff' : '#FAFAFA',
              cursor: selectedIds.size > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            批量标记为已处理
          </button>

          {/* 分页 */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">共 <span className="font-medium text-slate-700">{TOTAL}</span> 条数据</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className="w-8 h-8 flex items-center justify-center rounded border text-sm transition-colors"
                  style={{
                    borderColor: currentPage === p ? '#1890FF' : '#D9D9D9',
                    background: currentPage === p ? '#1890FF' : '#fff',
                    color: currentPage === p ? '#fff' : '#595959',
                    fontWeight: currentPage === p ? 600 : 400,
                  }}>
                  {p}
                </button>
              ))}
              <span className="text-slate-400 text-sm px-1">…</span>
              <button onClick={() => setCurrentPage(TOTAL_PAGES)}
                className="w-8 h-8 flex items-center justify-center rounded border text-sm transition-colors"
                style={{
                  borderColor: currentPage === TOTAL_PAGES ? '#1890FF' : '#D9D9D9',
                  background: currentPage === TOTAL_PAGES ? '#1890FF' : '#fff',
                  color: currentPage === TOTAL_PAGES ? '#fff' : '#595959',
                }}>
                {TOTAL_PAGES}
              </button>
              <button
                disabled={currentPage === TOTAL_PAGES}
                onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-500 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-slate-500">{currentPage} / {TOTAL_PAGES} 页</span>
          </div>
        </div>
      </div>
    </div>
  );
}
