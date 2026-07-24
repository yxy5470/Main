import React, { useState } from 'react';
import { Plus, Download, ChevronDown, ChevronUp, RefreshCw, X } from 'lucide-react';

type TaskStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
type TaskType = '固件升级' | '参数下发' | '远程重启' | '数据读取';

interface Task {
  id: number;
  taskNo: string;
  taskName: string;
  taskType: TaskType;
  targetCount: number;
  successCount: number;
  failCount: number;
  status: TaskStatus;
  creator: string;
  createdAt: string;
  finishedAt: string | null;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  pending:   { label: '待执行', text: '#D46B08', bg: '#FFF7E6', border: '#FFD591', dot: '#FA8C16' },
  running:   { label: '执行中', text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF', dot: '#1890FF' },
  success:   { label: '已完成', text: '#389E0D', bg: '#F6FFED', border: '#B7EB8F', dot: '#52C41A' },
  failed:    { label: '失败',   text: '#CF1322', bg: '#FFF1F0', border: '#FFA39E', dot: '#F5222D' },
  cancelled: { label: '已取消', text: '#595959', bg: '#F5F5F5', border: '#D9D9D9', dot: '#8C8C8C' },
};

const TYPE_STYLES: Record<TaskType, { text: string; bg: string; border: string }> = {
  '固件升级': { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  '参数下发': { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  '远程重启': { text: '#7D4E00', bg: '#FFF7E6', border: '#FFD591' },
  '数据读取': { text: '#006D75', bg: '#E6FFFB', border: '#87E8DE' },
};

const INITIAL_TASKS: Task[] = [
  { id: 1, taskNo: 'TASK-2024120001', taskName: '金堂水厂批量固件升级', taskType: '固件升级', targetCount: 32, successCount: 30, failCount: 2, status: 'success', creator: '张三', createdAt: '2024-12-01 10:00:00', finishedAt: '2024-12-01 11:30:00' },
  { id: 2, taskNo: 'TASK-2024120002', taskName: '空港水厂参数批量下发', taskType: '参数下发', targetCount: 15, successCount: 8, failCount: 0, status: 'running', creator: '李四', createdAt: '2024-12-02 09:00:00', finishedAt: null },
  { id: 3, taskNo: 'TASK-2024120003', taskName: '观测场设备远程重启', taskType: '远程重启', targetCount: 5, successCount: 0, failCount: 0, status: 'pending', creator: '王五', createdAt: '2024-12-02 14:00:00', finishedAt: null },
  { id: 4, taskNo: 'TASK-2024120004', taskName: '德阳文庙数据采集任务', taskType: '数据读取', targetCount: 20, successCount: 18, failCount: 2, status: 'failed', creator: '赵六', createdAt: '2024-12-01 16:00:00', finishedAt: '2024-12-01 16:45:00' },
  { id: 5, taskNo: 'TASK-2024110028', taskName: '渠县闸门参数下发', taskType: '参数下发', targetCount: 8, successCount: 0, failCount: 0, status: 'cancelled', creator: '张三', createdAt: '2024-11-28 09:30:00', finishedAt: '2024-11-28 10:00:00' },
  { id: 6, taskNo: 'TASK-2024110030', taskName: '都江堰轨道固件批量升级', taskType: '固件升级', targetCount: 45, successCount: 45, failCount: 0, status: 'success', creator: '李四', createdAt: '2024-11-30 08:00:00', finishedAt: '2024-11-30 10:20:00' },
];

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: cfg.text, background: cfg.bg, borderColor: cfg.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function TypeTag({ type }: { type: TaskType }) {
  const s = TYPE_STYLES[type];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: s.text, background: s.bg, borderColor: s.border }}>
      {type}
    </span>
  );
}

function ProgressBar({ success, fail, total }: { success: number; fail: number; total: number }) {
  const successPct = total > 0 ? (success / total) * 100 : 0;
  const failPct = total > 0 ? (fail / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
        <div className="h-full bg-green-500 rounded-l-full transition-all" style={{ width: `${successPct}%` }} />
        <div className="h-full bg-red-400 transition-all" style={{ width: `${failPct}%` }} />
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap">{success}/{total}</span>
    </div>
  );
}

export function TaskCenter() {
  const [tasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [taskNoSearch, setTaskNoSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'taskNo' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const totalItems = 38;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSort = (field: 'taskNo' | 'createdAt') => {
    if (sortField === field) {
      setSortOrder(v => v === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedItems(new Set(tasks.map(t => t.id)));
    else setSelectedItems(new Set());
  };

  const toggleSelectItem = (id: number) => {
    const s = new Set(selectedItems);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedItems(s);
  };

  const SortBtn = ({ field, label }: { field: 'taskNo' | 'createdAt'; label: string }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-slate-900">
      {label}
      <div className="flex flex-col">
        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === field && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
        <ChevronDown className={`w-3 h-3 ${sortField === field && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
      </div>
    </button>
  );

  return (
    <div className="size-full bg-[#F3F4F6] flex flex-col px-8 py-6 overflow-hidden">
      {/* 搜索筛选区 */}
      <div className="flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="任务编号"
              value={taskNoSearch}
              onChange={e => setTaskNoSearch(e.target.value)}
              className="w-48 h-9 px-3 py-1.5 pr-9 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent text-sm"
            />
            {taskNoSearch && (
              <button onClick={() => setTaskNoSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-500 text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="h-9 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm">
            <option value="">任务类型</option>
            <option value="固件升级">固件升级</option>
            <option value="参数下发">参数下发</option>
            <option value="远程重启">远程重启</option>
            <option value="数据读取">数据读取</option>
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-sm">
            <option value="">执行状态</option>
            <option value="pending">待执行</option>
            <option value="running">执行中</option>
            <option value="success">已完成</option>
            <option value="failed">失败</option>
            <option value="cancelled">已取消</option>
          </select>

          <button className="h-9 px-4 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm">
            查询
          </button>
          <button className="h-9 px-4 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium text-sm">
            重置
          </button>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="flex-1 min-h-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* 工具栏 */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 h-9 px-4 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium text-sm">
              <Plus className="w-4 h-4" />
              新建任务
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-4 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium text-sm">
              <Download className="w-4 h-4" />
              导出
            </button>
            <button className="inline-flex items-center gap-2 h-9 px-4 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium text-sm">
              <RefreshCw className="w-4 h-4" />
              刷新
            </button>
          </div>
          <div className="text-sm text-slate-500">
            已选 <span className="font-medium text-slate-700">{selectedItems.size}</span> 项
          </div>
        </div>

        {/* 表格 */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-white h-12 sticky top-0 z-10">
                <th className="px-4 text-left w-10">
                  <input type="checkbox" onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]" />
                </th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">
                  <SortBtn field="taskNo" label="任务编号" />
                </th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">任务名称</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">任务类型</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">执行进度</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">执行状态</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">创建人</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">
                  <SortBtn field="createdAt" label="创建时间" />
                </th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">完成时间</th>
                <th className="px-4 text-left text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors" style={{ height: '52px' }}>
                  <td className="px-4">
                    <input type="checkbox" checked={selectedItems.has(task.id)} onChange={() => toggleSelectItem(task.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]" />
                  </td>
                  <td className="px-4">
                    <span className="text-sm font-mono text-slate-600">{task.taskNo}</span>
                  </td>
                  <td className="px-4">
                    <span className="text-sm font-medium text-slate-900">{task.taskName}</span>
                  </td>
                  <td className="px-4">
                    <TypeTag type={task.taskType} />
                  </td>
                  <td className="px-4 min-w-[160px]">
                    <ProgressBar success={task.successCount} fail={task.failCount} total={task.targetCount} />
                  </td>
                  <td className="px-4">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4">
                    <span className="text-sm text-slate-700">{task.creator}</span>
                  </td>
                  <td className="px-4">
                    <span className="text-sm text-slate-600">{task.createdAt}</span>
                  </td>
                  <td className="px-4">
                    <span className="text-sm text-slate-500">{task.finishedAt ?? '—'}</span>
                  </td>
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">详情</button>
                      {task.status === 'running' && (
                        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">终止</button>
                      )}
                      {task.status === 'pending' && (
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">取消</button>
                      )}
                      {(task.status === 'failed' || task.status === 'cancelled') && (
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">重试</button>
                      )}
                      {(task.status === 'success' || task.status === 'failed') && (
                        <button className="text-sm text-red-500 hover:text-red-600 font-medium">删除</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页器 */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">共 {totalItems} 条</div>

          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
              &lt;
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${currentPage === page ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-slate-300 hover:bg-slate-50'}`}>
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-slate-400">...</span>
                <button onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 border rounded text-sm ${currentPage === totalPages ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'border-slate-300 hover:bg-slate-50'}`}>
                  {totalPages}
                </button>
              </>
            )}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
