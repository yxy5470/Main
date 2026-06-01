import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
type TicketStatus = 'replied' | 'pending' | 'resolved';
type IssueType = 'device' | 'bug' | 'request' | 'performance' | 'other';

interface Ticket {
  id: string;
  no: string;
  summary: string;
  hasNewReply: boolean;
  project: string;
  issueType: IssueType;
  status: TicketStatus;
  submitTime: string;
  lastUpdate: string;
  resolved: boolean;
}

const TICKETS: Ticket[] = [
  {
    id: '1', no: 'TK-1025-003',
    summary: 'Modbus RTU 设备批量离线，日志提示解析异常',
    hasNewReply: true,
    project: 'A市智慧水务一期', issueType: 'device',
    status: 'replied', submitTime: '2023-10-25 09:12', lastUpdate: '今天 14:05', resolved: false,
  },
  {
    id: '2', no: 'TK-1025-008',
    summary: '大屏数据看板的图表刷新存在延迟',
    hasNewReply: false,
    project: '数据可视化大屏', issueType: 'bug',
    status: 'pending', submitTime: '今天 11:30', lastUpdate: '今天 11:30', resolved: false,
  },
  {
    id: '3', no: 'TK-1018-022',
    summary: '申请开通企业级 API 接口调用权限',
    hasNewReply: false,
    project: '全局配置', issueType: 'request',
    status: 'resolved', submitTime: '2023-10-18 10:00', lastUpdate: '2023-10-19 16:22', resolved: true,
  },
  {
    id: '4', no: 'TK-1023-011',
    summary: 'MQTT 设备上报数据偶发性丢包，频率约 3%',
    hasNewReply: false,
    project: 'B区园区物联网', issueType: 'device',
    status: 'pending', submitTime: '2023-10-23 15:40', lastUpdate: '2023-10-23 15:40', resolved: false,
  },
  {
    id: '5', no: 'TK-1020-005',
    summary: '告警规则配置页面在 Safari 浏览器下布局错乱',
    hasNewReply: false,
    project: 'A市智慧水务一期', issueType: 'bug',
    status: 'resolved', submitTime: '2023-10-20 11:00', lastUpdate: '2023-10-22 09:30', resolved: true,
  },
  {
    id: '6', no: 'TK-1024-017',
    summary: '希望支持设备数据的自定义报表导出（Excel格式）',
    hasNewReply: false,
    project: 'B区园区物联网', issueType: 'request',
    status: 'replied', submitTime: '2023-10-24 14:20', lastUpdate: '今天 10:15', resolved: false,
  },
  {
    id: '7', no: 'TK-1021-009',
    summary: '首页地图加载缓慢，超过 5 秒无响应',
    hasNewReply: false,
    project: '全局配置', issueType: 'performance',
    status: 'resolved', submitTime: '2023-10-21 08:50', lastUpdate: '2023-10-23 17:00', resolved: true,
  },
];

const PROJECT_OPTIONS = ['关联项目（全部）', 'A市智慧水务一期', 'B区园区物联网', '数据可视化大屏', '全局配置'];
const STATUS_OPTIONS  = ['当前状态（全部）', '待平台处理', '平台已回复', '已解决'];

const STATUS_META: Record<TicketStatus, { label: string; dotColor: string; textColor: string }> = {
  replied:  { label: '平台已回复', dotColor: '#1890FF', textColor: '#096DD9' },
  pending:  { label: '待平台处理', dotColor: '#FA8C16', textColor: '#AD4E00' },
  resolved: { label: '已解决',     dotColor: '#52C41A', textColor: '#389E0D' },
};

const TYPE_META: Record<IssueType, { label: string; color: string; bg: string; border: string }> = {
  device:      { label: '设备接入问题',   color: '#AD4E00', bg: '#FFF7E6', border: '#FFD591' },
  bug:         { label: '系统 Bug',       color: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  request:     { label: '需求/权限申请',  color: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  performance: { label: '性能问题',       color: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  other:       { label: '其他',           color: '#595959', bg: '#F5F5F5', border: '#D9D9D9' },
};

/* ─────────────────── small components ─────────────────── */
function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[170px]">
        <span className="flex-1 text-left truncate">{value}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E8E8E8] rounded z-20 min-w-full"
          style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#F5F5F5] transition-colors"
              style={{ color: opt === value ? '#1890FF' : '#262626' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ current, total, pageSize, onChange }: {
  current: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors"
          style={{
            borderColor: p === current ? '#1890FF' : '#D9D9D9',
            background:  p === current ? '#1890FF' : 'white',
            color:       p === current ? 'white'   : '#595959',
          }}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
    </div>
  );
}

/* ─────────────────── stat cards ─────────────────── */
function StatCards({ tickets }: { tickets: Ticket[] }) {
  const total    = tickets.length;
  const pending  = tickets.filter(t => t.status === 'pending').length;
  const replied  = tickets.filter(t => t.status === 'replied').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;

  const cards = [
    { label: '全部工单',   value: total,    color: '#1890FF', bg: '#E6F7FF', border: '#BAE7FF' },
    { label: '待平台处理', value: pending,  color: '#FA8C16', bg: '#FFF7E6', border: '#FFE7BA' },
    { label: '平台已回复', value: replied,  color: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
    { label: '已解决',     value: resolved, color: '#389E0D', bg: '#F6FFED', border: '#D9F7BE' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-lg border px-5 py-4 flex items-center gap-4"
          style={{ borderColor: c.border, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: c.bg }}>
            <span className="text-xl font-bold" style={{ color: c.color }}>{c.value}</span>
          </div>
          <div>
            <div className="text-xs text-[#8C8C8C]">{c.label}</div>
            <div className="text-lg font-bold text-[#262626]">{c.value} <span className="text-xs font-normal text-[#BFBFBF]">条</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function FeedbackManagement() {
  const [keyword, setKeyword]  = useState('');
  const [project, setProject]  = useState('关联项目（全部）');
  const [status, setStatus]    = useState('当前状态（全部）');
  const [currentPage, setPage] = useState(1);

  const TOTAL = 15;
  const PAGE_SIZE = 10;

  const filtered = TICKETS.filter(t => {
    const matchKw = !keyword || t.summary.includes(keyword) || t.no.includes(keyword);
    const matchPj = project === '关联项目（全部）' || t.project === project;
    const matchSt =
      status === '当前状态（全部）' ||
      (status === '待平台处理' && t.status === 'pending') ||
      (status === '平台已回复' && t.status === 'replied') ||
      (status === '已解决'     && t.status === 'resolved');
    return matchKw && matchPj && matchSt;
  });

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="space-y-4">

        {/* ── 统计卡片 ── */}
        <StatCards tickets={TICKETS} />

        {/* ── 顶部搜索区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="搜索问题关键字 / 单号"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(1); }}
              className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
                placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
                focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
              style={{ minWidth: 220 }}
            />
            <Select value={project} options={PROJECT_OPTIONS} onChange={v => { setProject(v); setPage(1); }} />
            <Select value={status}  options={STATUS_OPTIONS}  onChange={v => { setStatus(v);  setPage(1); }} />

            <button onClick={() => setPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 搜索
            </button>

            <div className="ml-auto">
              <button className="h-8 px-5 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                transition-colors flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 0 rgba(0,0,0,0.045)' }}>
                <span className="text-base leading-none">⊕</span>
                提交新反馈
              </button>
            </div>
          </div>
        </div>

        {/* ── 数据表格 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E8E8E8' }}>
                {['工单编号', '问题摘要', '关联项目 / 模块', '问题类型', '当前状态', '提交时间', '最后更新', '操作'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => {
                const statusMeta = STATUS_META[ticket.status];
                const typeMeta   = TYPE_META[ticket.issueType];
                const isResolved = ticket.status === 'resolved';

                return (
                  <tr key={ticket.id} className="hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderBottom: '1px solid #F0F0F0' }}>

                    {/* 工单编号 */}
                    <td className="px-4 py-3">
                      <code className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'SFMono-Regular, Consolas, monospace',
                          color: '#595959', background: '#F5F5F5', border: '1px solid #E8E8E8',
                        }}>
                        {ticket.no}
                      </code>
                    </td>

                    {/* 问题摘要 */}
                    <td className="px-4 py-3" style={{ maxWidth: 300 }}>
                      <div className="flex items-center gap-2">
                        {ticket.hasNewReply && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap flex-shrink-0"
                            style={{ background: '#FF4D4F', color: '#fff', lineHeight: 1 }}>
                            New回复
                          </span>
                        )}
                        <span className={`text-sm ${isResolved ? 'text-[#BFBFBF]' : 'font-semibold text-[#262626]'} line-clamp-1`}>
                          {ticket.summary}
                        </span>
                      </div>
                    </td>

                    {/* 关联项目 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#595959] whitespace-nowrap">{ticket.project}</span>
                    </td>

                    {/* 问题类型 */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap"
                        style={{ color: typeMeta.color, background: typeMeta.bg, borderColor: typeMeta.border }}>
                        {typeMeta.label}
                      </span>
                    </td>

                    {/* 当前状态 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: statusMeta.dotColor }} />
                        <span className="text-sm" style={{ color: statusMeta.textColor }}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </td>

                    {/* 提交时间 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8C8C8C] whitespace-nowrap">{ticket.submitTime}</span>
                    </td>

                    {/* 最后更新 */}
                    <td className="px-4 py-3">
                      <span className={`text-sm whitespace-nowrap ${ticket.hasNewReply ? 'text-[#1890FF] font-medium' : 'text-[#8C8C8C]'}`}>
                        {ticket.lastUpdate}
                      </span>
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {ticket.status === 'replied' && (
                        <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] transition-colors font-medium">
                          查看并回复
                        </button>
                      )}
                      {ticket.status === 'pending' && (
                        <div className="flex items-center gap-0.5">
                          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-0.5 transition-colors">补充信息</button>
                          <span className="text-[#D9D9D9] text-xs">|</span>
                          <button className="text-xs text-[#FF4D4F] hover:text-[#FF7875] px-0.5 transition-colors">撤销</button>
                        </div>
                      )}
                      {ticket.status === 'resolved' && (
                        <button className="text-xs text-[#8C8C8C] hover:text-[#595959] transition-colors">
                          查看详情
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 底部分页 */}
          <div className="px-4 py-3 flex items-center justify-end gap-4 border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-sm text-[#8C8C8C]">共 {TOTAL} 条反馈记录</span>
            <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </div>

      </div>
    </div>
  );
}
