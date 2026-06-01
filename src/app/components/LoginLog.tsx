import { useState } from 'react';
import { ChevronDown, Calendar, Download } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
interface LogEntry {
  id: string;
  account: string;
  username: string;
  ip: string;
  region: string;
  browser: string;
  os: string;
  status: 'success' | 'fail_password' | 'fail_locked' | 'fail_expired';
  time: string;
}

const LOGS: LogEntry[] = [
  { id: '1',  account: 'admin',     username: '系统管理员', ip: '121.22.45.102', region: '浙江省杭州市', browser: 'Chrome 118',  os: 'Windows 11',  status: 'success',       time: '2023-10-25 14:22:15' },
  { id: '2',  account: 'guest_01',  username: '未知',       ip: '45.33.21.99',   region: '海外节点',     browser: 'Unknown',      os: 'Linux',        status: 'fail_password', time: '2023-10-25 14:10:02' },
  { id: '3',  account: 'zhang_wei', username: '张伟',       ip: '183.60.12.88',  region: '广东省广州市', browser: 'Edge 118',     os: 'Windows 10',  status: 'success',       time: '2023-10-25 13:55:40' },
  { id: '4',  account: 'guest_01',  username: '未知',       ip: '45.33.21.99',   region: '海外节点',     browser: 'Unknown',      os: 'Linux',        status: 'fail_password', time: '2023-10-25 13:52:18' },
  { id: '5',  account: 'guest_01',  username: '未知',       ip: '45.33.21.99',   region: '海外节点',     browser: 'Unknown',      os: 'Linux',        status: 'fail_locked',   time: '2023-10-25 13:51:03' },
  { id: '6',  account: 'li_fang',   username: '李芳',       ip: '114.87.33.201', region: '上海市',       browser: 'Safari 17',    os: 'macOS 14',    status: 'success',       time: '2023-10-25 11:30:22' },
  { id: '7',  account: 'op_user2',  username: '运维员乙',   ip: '10.0.5.32',     region: '内网',         browser: 'Firefox 119',  os: 'Ubuntu 22',   status: 'success',       time: '2023-10-25 09:14:55' },
  { id: '8',  account: 'wang_jun',  username: '王军',       ip: '59.46.78.155',  region: '辽宁省沈阳市', browser: 'Chrome 117',   os: 'Windows 10',  status: 'fail_expired',  time: '2023-10-24 18:03:41' },
  { id: '9',  account: 'admin',     username: '系统管理员', ip: '121.22.45.102', region: '浙江省杭州市', browser: 'Chrome 118',   os: 'Windows 11',  status: 'success',       time: '2023-10-24 17:45:09' },
  { id: '10', account: 'chen_na',   username: '陈娜',       ip: '223.104.6.77',  region: '北京市',       browser: 'Chrome 118',   os: 'macOS 13',    status: 'success',       time: '2023-10-24 16:22:30' },
];

const STATUS_OPTIONS = ['登录状态（全部）', '成功', '失败'];

const STATUS_META = {
  success:       { label: '成功 (Success)',    color: '#389E0D', bg: '#F6FFED', border: '#B7EB8F' },
  fail_password: { label: '失败 (密码错误)',   color: '#CF1322', bg: '#FFF1F0', border: '#FFA39E' },
  fail_locked:   { label: '失败 (账户锁定)',   color: '#CF1322', bg: '#FFF1F0', border: '#FFA39E' },
  fail_expired:  { label: '失败 (会话过期)',   color: '#AD4E00', bg: '#FFF7E6', border: '#FFD591' },
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

function DateRangePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 h-8 px-3 border border-[#D9D9D9] rounded bg-white
      hover:border-[#40A9FF] transition-colors cursor-pointer min-w-[230px]"
      onClick={() => {}}>
      <Calendar className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
      <span className="text-sm text-[#595959] flex-1 select-none">{value}</span>
    </div>
  );
}

function Pagination({ current, total, pageSize, onChange }: {
  current: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);
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
            background: p === current ? '#1890FF' : 'white',
            color: p === current ? 'white' : '#595959',
          }}>{p}</button>
      ))}
      {totalPages > 5 && <span className="px-1 text-[#8C8C8C] text-sm">…</span>}
      {totalPages > 5 && (
        <button onClick={() => onChange(totalPages)}
          className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
            hover:border-[#40A9FF] hover:text-[#1890FF] transition-colors"
          style={{ color: current === totalPages ? 'white' : '#595959', background: current === totalPages ? '#1890FF' : 'white', borderColor: current === totalPages ? '#1890FF' : '#D9D9D9' }}>
          {totalPages}
        </button>
      )}
      <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function LoginLog() {
  const [keyword, setKeyword]   = useState('');
  const [dateRange]             = useState('2023-10-01 ~ 2023-10-31');
  const [status, setStatus]     = useState('登录状态（全部）');
  const [currentPage, setPage]  = useState(1);

  const TOTAL = 1402;
  const PAGE_SIZE = 10;

  const filtered = LOGS.filter(entry => {
    const matchKw = !keyword || entry.account.includes(keyword) || entry.ip.includes(keyword);
    const matchStatus =
      status === '登录状态（全部）' ||
      (status === '成功' && entry.status === 'success') ||
      (status === '失败' && entry.status !== 'success');
    return matchKw && matchStatus;
  });

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="space-y-4">

        {/* ── 顶部搜索区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 账号/IP 输入 */}
            <input
              type="text"
              placeholder="登录账号 / IP"
              value={keyword}
              onChange={e => { setKeyword(e.target.value); setPage(1); }}
              className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
                placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
                focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
              style={{ minWidth: 180 }}
            />

            {/* 日期范围 */}
            <DateRangePicker value={dateRange} onChange={() => {}} />

            {/* 状态下拉 */}
            <Select value={status} options={STATUS_OPTIONS} onChange={v => { setStatus(v); setPage(1); }} />

            {/* 查询 */}
            <button onClick={() => setPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 查询
            </button>

            {/* 导出（靠右） */}
            <div className="ml-auto">
              <button className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                hover:text-[#1890FF] text-sm rounded bg-white transition-colors flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                导出当前日志
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
                {['登录账号', '用户名称', '登录 IP', '归属地', '浏览器 / OS', '登录状态', '登录时间'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, idx) => {
                const meta = STATUS_META[entry.status];
                const isFailure = entry.status !== 'success';
                return (
                  <tr key={entry.id}
                    className="transition-colors"
                    style={{
                      borderBottom: '1px solid #F0F0F0',
                      background: isFailure ? '#FFFBFB' : 'white',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = isFailure ? '#FFF5F5' : '#FAFAFA')}
                    onMouseLeave={e => (e.currentTarget.style.background = isFailure ? '#FFFBFB' : 'white')}
                  >
                    {/* 账号 */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#262626]">{entry.account}</span>
                    </td>

                    {/* 用户名称 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#595959]">{entry.username}</span>
                    </td>

                    {/* IP */}
                    <td className="px-4 py-3">
                      <code className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'SFMono-Regular, Consolas, monospace',
                          color: isFailure ? '#CF1322' : '#595959',
                          background: isFailure ? '#FFF1F0' : '#F5F5F5',
                          border: `1px solid ${isFailure ? '#FFA39E' : '#E8E8E8'}`,
                        }}>
                        {entry.ip}
                      </code>
                    </td>

                    {/* 归属地 */}
                    <td className="px-4 py-3">
                      <span className="text-sm" style={{ color: entry.region === '海外节点' ? '#AD4E00' : '#595959' }}>
                        {entry.region === '海外节点' && <span className="mr-1">⚠️</span>}
                        {entry.region}
                      </span>
                    </td>

                    {/* 浏览器/OS */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-[#8C8C8C]">{entry.browser}</span>
                        <span className="text-xs text-[#BFBFBF]">{entry.os}</span>
                      </div>
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                        style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}>
                        {meta.label}
                      </span>
                    </td>

                    {/* 时间 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8C8C8C]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {entry.time}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── 底部分页 ── */}
          <div className="px-4 py-3 flex items-center justify-end gap-4 border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-sm text-[#8C8C8C]">共 1,402 条日志</span>
            <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </div>

      </div>
    </div>
  );
}
