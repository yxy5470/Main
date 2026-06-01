import { useState } from 'react';
import { ChevronDown, Calendar, Download, X } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
type OpType = 'delete' | 'update' | 'create';
type OpStatus = 'success' | 'fail';

interface OpLog {
  id: string;
  operator: string;
  module: string;
  opType: OpType;
  description: string;
  ip: string;
  status: OpStatus;
  failReason?: string;
  time: string;
  detail: string;
}

const LOGS: OpLog[] = [
  {
    id: '1', operator: 'Admin', module: '数据类型', opType: 'delete',
    description: '删除了数据类型【标识码: 201】',
    ip: '192.168.1.10', status: 'success', time: '2023-10-25 15:00:00',
    detail: '{"action":"DELETE","target":"data_type","code":"201","name":"倾角","operator":"admin","result":"ok","timestamp":"2023-10-25T15:00:00Z"}',
  },
  {
    id: '2', operator: 'Tech_Li', module: '告警中心', opType: 'update',
    description: '修改了设备【CR120251120001】的报警阈值',
    ip: '10.0.22.4', status: 'success', time: '2023-10-25 14:30:12',
    detail: '{"action":"UPDATE","target":"alarm_rule","deviceId":"CR120251120001","field":"threshold","before":5.0,"after":3.5,"operator":"Tech_Li","result":"ok","timestamp":"2023-10-25T14:30:12Z"}',
  },
  {
    id: '3', operator: 'Viewer_01', module: '设备管理', opType: 'create',
    description: '添加设备',
    ip: '172.16.0.5', status: 'fail', failReason: '权限不足', time: '2023-10-25 11:15:00',
    detail: '{"action":"POST","target":"device","operator":"Viewer_01","result":"forbidden","reason":"PERMISSION_DENIED","timestamp":"2023-10-25T11:15:00Z"}',
  },
  {
    id: '4', operator: 'Admin', module: '用户管理', opType: 'create',
    description: '新增用户账号 [zhang_wei]',
    ip: '192.168.1.10', status: 'success', time: '2023-10-25 10:52:33',
    detail: '{"action":"POST","target":"user","username":"zhang_wei","role":"senior_op","operator":"admin","result":"ok"}',
  },
  {
    id: '5', operator: 'Tech_Li', module: '设备管理', opType: 'update',
    description: '更新设备【SE200251130002】基本信息',
    ip: '10.0.22.4', status: 'success', time: '2023-10-25 10:20:07',
    detail: '{"action":"UPDATE","target":"device","deviceId":"SE200251130002","fields":["name","location"],"operator":"Tech_Li","result":"ok"}',
  },
  {
    id: '6', operator: 'Admin', module: '角色管理', opType: 'update',
    description: '修改角色【项目只读访客】权限配置',
    ip: '192.168.1.10', status: 'success', time: '2023-10-24 17:40:55',
    detail: '{"action":"UPDATE","target":"role","roleId":"readonly","permissionsAdded":[],"permissionsRemoved":["alarm-handle"],"operator":"admin","result":"ok"}',
  },
  {
    id: '7', operator: 'System_Op', module: '通知公告', opType: 'delete',
    description: '删除草稿公告【停机维护公告】',
    ip: '10.0.0.1', status: 'success', time: '2023-10-24 16:05:18',
    detail: '{"action":"DELETE","target":"notice","noticeId":"draft_002","title":"停机维护公告","operator":"System_Op","result":"ok"}',
  },
  {
    id: '8', operator: 'Viewer_01', module: '设备管理', opType: 'delete',
    description: '删除设备',
    ip: '172.16.0.5', status: 'fail', failReason: '权限不足', time: '2023-10-24 14:22:01',
    detail: '{"action":"DELETE","target":"device","operator":"Viewer_01","result":"forbidden","reason":"PERMISSION_DENIED"}',
  },
];

const MODULE_OPTIONS = ['操作模块（全部）', '设备管理', '告警中心', '数据类型', '用户管理', '角色管理', '通知公告'];
const TYPE_OPTIONS   = ['操作类型（全部）', '新增', '修改', '删除'];

const OP_META: Record<OpType, { label: string; color: string; bg: string; border: string }> = {
  delete: { label: '删除 (DELETE)', color: '#CF1322', bg: '#FFF1F0', border: '#FFA39E' },
  update: { label: '修改 (UPDATE)', color: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  create: { label: '新增 (POST)',   color: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
};

/* ─────────────────── small components ─────────────────── */
function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[160px]">
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
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);
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
      {totalPages > 5 && <span className="px-1 text-[#8C8C8C] text-sm">…{totalPages}</span>}
      <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
    </div>
  );
}

/* ─────────────────── detail drawer ─────────────────── */
function DetailDrawer({ log, onClose }: { log: OpLog; onClose: () => void }) {
  const meta = OP_META[log.opType];
  let parsed: Record<string, unknown> | null = null;
  try { parsed = JSON.parse(log.detail); } catch { /* ignore */ }

  return (
    <>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/20 z-30" onClick={onClose} />

      {/* drawer */}
      <div className="fixed top-0 right-0 h-full w-[480px] bg-white z-40 flex flex-col"
        style={{ boxShadow: '-4px 0 16px rgba(0,0,0,0.12)' }}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
          <h3 className="text-base font-semibold text-[#262626]">操作详情</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#F5F5F5] transition-colors text-[#8C8C8C] hover:text-[#262626]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          {/* meta info */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: '操作人员', value: log.operator },
              { label: '业务模块', value: log.module },
              { label: '客户端 IP', value: log.ip, mono: true },
              { label: '操作时间', value: log.time, mono: true },
            ].map(item => (
              <div key={item.label}>
                <div className="text-xs text-[#8C8C8C] mb-1">{item.label}</div>
                <div className={`text-sm text-[#262626] ${item.mono ? 'font-mono' : ''}`}>{item.value}</div>
              </div>
            ))}
            <div>
              <div className="text-xs text-[#8C8C8C] mb-1">操作类型</div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
                {meta.label}
              </span>
            </div>
            <div>
              <div className="text-xs text-[#8C8C8C] mb-1">操作状态</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: log.status === 'success' ? '#52C41A' : '#FF4D4F' }} />
                <span className="text-sm" style={{ color: log.status === 'success' ? '#389E0D' : '#CF1322' }}>
                  {log.status === 'success' ? '成功' : `失败 (${log.failReason})`}
                </span>
              </div>
            </div>
          </div>

          {/* description */}
          <div>
            <div className="text-xs text-[#8C8C8C] mb-1">操作描述</div>
            <div className="text-sm text-[#262626] bg-[#FAFAFA] border border-[#F0F0F0] rounded px-3 py-2">
              {log.description}
            </div>
          </div>

          {/* raw JSON */}
          <div>
            <div className="text-xs text-[#8C8C8C] mb-2">原始报文 (JSON)</div>
            <pre className="text-xs rounded p-4 overflow-auto"
              style={{
                fontFamily: 'SFMono-Regular, Consolas, monospace',
                background: '#1E293B', color: '#E2E8F0',
                lineHeight: 1.7, maxHeight: 340,
              }}>
              {parsed ? JSON.stringify(parsed, null, 2) : log.detail}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── main page ─────────────────── */
export function OperationLog() {
  const [keyword, setKeyword]   = useState('');
  const [module, setModule]     = useState('操作模块（全部）');
  const [opType, setOpType]     = useState('操作类型（全部）');
  const [currentPage, setPage]  = useState(1);
  const [drawerLog, setDrawer]  = useState<OpLog | null>(null);

  const TOTAL = 867;
  const PAGE_SIZE = 10;

  const filtered = LOGS.filter(entry => {
    const matchKw   = !keyword || entry.operator.toLowerCase().includes(keyword.toLowerCase());
    const matchMod  = module === '操作模块（全部）' || entry.module === module;
    const matchType =
      opType === '操作类型（全部）' ||
      (opType === '新增' && entry.opType === 'create') ||
      (opType === '修改' && entry.opType === 'update') ||
      (opType === '删除' && entry.opType === 'delete');
    return matchKw && matchMod && matchType;
  });

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="space-y-4">

        {/* ── 顶部搜索区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="操作人员"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(1); }}
              className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
                placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
                focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
              style={{ minWidth: 150 }}
            />
            <Select value={module} options={MODULE_OPTIONS} onChange={v => { setModule(v); setPage(1); }} />
            <Select value={opType} options={TYPE_OPTIONS}   onChange={v => { setOpType(v); setPage(1); }} />

            {/* 日期范围（静态展示） */}
            <div className="flex items-center gap-2 h-8 px-3 border border-[#D9D9D9] rounded bg-white
              hover:border-[#40A9FF] transition-colors cursor-pointer" style={{ minWidth: 230 }}>
              <Calendar className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
              <span className="text-sm text-[#595959] select-none">2023-10-01 ~ 2023-10-31</span>
            </div>

            <button onClick={() => setPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 查询
            </button>

            <div className="ml-auto">
              <button className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                hover:text-[#1890FF] text-sm rounded bg-white transition-colors flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                导出记录
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
                {['操作人员', '业务模块', '操作类型', '操作描述', '客户端 IP', '操作状态', '操作时间', '操作'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const meta = OP_META[entry.opType];
                const isFail   = entry.status === 'fail';
                const isDanger = entry.opType === 'delete';
                return (
                  <tr key={entry.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid #F0F0F0',
                      background: isFail ? '#FFFBFB' : isDanger ? '#FFFEF5' : 'white',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0F7FF')}
                    onMouseLeave={e => (e.currentTarget.style.background = isFail ? '#FFFBFB' : isDanger ? '#FFFEF5' : 'white')}
                  >
                    {/* 操作人员 */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#262626]">{entry.operator}</span>
                    </td>

                    {/* 业务模块 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#595959]">{entry.module}</span>
                    </td>

                    {/* 操作类型 */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                        style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
                        {meta.label}
                      </span>
                    </td>

                    {/* 操作描述 */}
                    <td className="px-4 py-3" style={{ maxWidth: 260 }}>
                      <span className="text-sm text-[#434343] line-clamp-1">{entry.description}</span>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3">
                      <code className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'SFMono-Regular, Consolas, monospace',
                          color: '#595959', background: '#F5F5F5', border: '1px solid #E8E8E8',
                        }}>
                        {entry.ip}
                      </code>
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: isFail ? '#FF4D4F' : '#52C41A' }} />
                        <span className="text-xs" style={{ color: isFail ? '#CF1322' : '#389E0D' }}>
                          {isFail ? `失败 (${entry.failReason})` : '成功'}
                        </span>
                      </div>
                    </td>

                    {/* 时间 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8C8C8C]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {entry.time}
                      </span>
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3">
                      <button onClick={() => setDrawer(entry)}
                        className="text-xs text-[#1890FF] hover:text-[#40A9FF] transition-colors">
                        查看详情
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 底部分页 */}
          <div className="px-4 py-3 flex items-center justify-end gap-4 border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-sm text-[#8C8C8C]">共 {TOTAL.toLocaleString()} 条记录</span>
            <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </div>
      </div>

      {/* ── 详情抽屉 ── */}
      {drawerLog && <DetailDrawer log={drawerLog} onClose={() => setDrawer(null)} />}
    </div>
  );
}
