import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
interface Notice {
  id: string;
  title: string;
  isNew: boolean;
  type: string;
  typeColor: 'blue' | 'orange' | 'green' | 'red';
  status: 'published' | 'draft';
  target: string;
  creator: string;
  publishTime: string;
}

const NOTICES: Notice[] = [
  {
    id: '1', title: 'V2.4版本平台升级更新通知', isNew: true,
    type: '系统升级', typeColor: 'blue',
    status: 'published', target: '全平台用户',
    creator: 'Admin', publishTime: '2023-10-25 10:00:00',
  },
  {
    id: '2', title: '停机维护公告', isNew: false,
    type: '停机维护', typeColor: 'orange',
    status: 'draft', target: '指定设备分组',
    creator: 'System_Op', publishTime: '--',
  },
  {
    id: '3', title: '国庆假期系统值班安排通知', isNew: false,
    type: '系统公告', typeColor: 'green',
    status: 'published', target: '全平台用户',
    creator: 'Admin', publishTime: '2023-09-28 09:00:00',
  },
  {
    id: '4', title: '数据备份策略调整通知', isNew: false,
    type: '系统升级', typeColor: 'blue',
    status: 'published', target: '超级管理员',
    creator: 'Admin', publishTime: '2023-09-15 14:30:00',
  },
  {
    id: '5', title: '新版告警规则引擎上线公告', isNew: false,
    type: '系统升级', typeColor: 'blue',
    status: 'draft', target: '全平台用户',
    creator: 'System_Op', publishTime: '--',
  },
  {
    id: '6', title: '服务器扩容维护窗口通知', isNew: false,
    type: '停机维护', typeColor: 'orange',
    status: 'published', target: '全平台用户',
    creator: 'Admin', publishTime: '2023-08-20 08:00:00',
  },
  {
    id: '7', title: '平台安全漏洞修复紧急公告', isNew: false,
    type: '紧急公告', typeColor: 'red',
    status: 'published', target: '全平台用户',
    creator: 'Admin', publishTime: '2023-08-05 18:00:00',
  },
  {
    id: '8', title: '第三方接口协议变更通知', isNew: false,
    type: '系统公告', typeColor: 'green',
    status: 'draft', target: '集成商管理员',
    creator: 'System_Op', publishTime: '--',
  },
];

const TYPE_OPTIONS  = ['公告类型（全部）', '系统升级', '停机维护', '系统公告', '紧急公告'];
const STATUS_OPTIONS = ['发布状态（全部）', '已发布', '草稿'];

const TAG_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  blue:   { color: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  orange: { color: '#AD4E00', bg: '#FFF7E6', border: '#FFD591' },
  green:  { color: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  red:    { color: '#CF1322', bg: '#FFF1F0', border: '#FFA39E' },
};

/* ─────────────────── small components ─────────────────── */
function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[150px]"
      >
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
            background: p === current ? '#1890FF' : 'white',
            color: p === current ? 'white' : '#595959',
          }}>{p}</button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function NoticeManagement() {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState('公告类型（全部）');
  const [status, setStatus]   = useState('发布状态（全部）');
  const [currentPage, setPage] = useState(1);

  const TOTAL = 24;
  const PAGE_SIZE = 8;

  const filtered = NOTICES.filter(n => {
    const matchTitle  = !title || n.title.includes(title);
    const matchType   = type === '公告类型（全部）' || n.type === type;
    const matchStatus =
      status === '发布状态（全部）' ||
      (status === '已发布' && n.status === 'published') ||
      (status === '草稿'   && n.status === 'draft');
    return matchTitle && matchType && matchStatus;
  });

  const handleReset = () => { setTitle(''); setType('公告类型（全部）'); setStatus('发布状态（全部）'); setPage(1); };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="space-y-4">

        {/* ── 顶部搜索区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 标题输入 */}
            <input
              type="text"
              placeholder="公告标题"
              value={title}
              onChange={e => { setTitle(e.target.value); setPage(1); }}
              className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
                placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
                focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
              style={{ minWidth: 200 }}
            />
            <Select value={type}   options={TYPE_OPTIONS}   onChange={v => { setType(v);   setPage(1); }} />
            <Select value={status} options={STATUS_OPTIONS} onChange={v => { setStatus(v); setPage(1); }} />

            <button
              onClick={() => setPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 查询
            </button>
            <button
              onClick={handleReset}
              className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                hover:text-[#1890FF] text-sm rounded bg-white transition-colors">
              重置
            </button>

            <div className="ml-auto">
              <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                transition-colors flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 0 rgba(0,0,0,0.045)' }}>
                <span className="text-base leading-none">⊕</span>
                发布新公告
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
                {['序号', '公告标题', '公告类型', '发布状态', '目标对象', '创建人', '发布时间', '操作'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((notice, idx) => {
                const tc = TAG_STYLE[notice.typeColor];
                const isPublished = notice.status === 'published';
                return (
                  <tr key={notice.id} className="hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderBottom: '1px solid #F0F0F0' }}>
                    {/* 序号 */}
                    <td className="px-4 py-3 text-sm text-[#8C8C8C] w-12">{idx + 1}</td>

                    {/* 标题 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#262626]">{notice.title}</span>
                        {notice.isNew && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold"
                            style={{ background: '#FF4D4F', color: '#fff', lineHeight: 1 }}>
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 类型 */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                        style={{ color: tc.color, background: tc.bg, borderColor: tc.border }}>
                        {notice.type}
                      </span>
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: isPublished ? '#52C41A' : '#8C8C8C' }} />
                        <span className="text-sm" style={{ color: isPublished ? '#389E0D' : '#8C8C8C' }}>
                          {isPublished ? '已发布' : '草稿'}
                        </span>
                      </div>
                    </td>

                    {/* 目标对象 */}
                    <td className="px-4 py-3 text-sm text-[#595959]">{notice.target}</td>

                    {/* 创建人 */}
                    <td className="px-4 py-3 text-sm text-[#595959]">{notice.creator}</td>

                    {/* 发布时间 */}
                    <td className="px-4 py-3 text-sm"
                      style={{ color: notice.publishTime === '--' ? '#BFBFBF' : '#8C8C8C' }}>
                      {notice.publishTime}
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isPublished ? (
                        <div className="flex items-center gap-0.5">
                          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">查看</button>
                          <span className="text-[#D9D9D9] text-xs">|</span>
                          <button className="text-xs text-[#FA8C16] hover:text-[#FFA940] px-1 transition-colors">撤回</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">编辑</button>
                          <span className="text-[#D9D9D9] text-xs">|</span>
                          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">发布</button>
                          <span className="text-[#D9D9D9] text-xs">|</span>
                          <button className="text-xs text-[#FF4D4F] hover:text-[#FF7875] px-1 transition-colors">删除</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── 底部分页 ── */}
          <div className="px-4 py-3 flex items-center justify-end gap-4 border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-sm text-[#8C8C8C]">共 {TOTAL} 条记录</span>
            <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        </div>

      </div>
    </div>
  );
}
