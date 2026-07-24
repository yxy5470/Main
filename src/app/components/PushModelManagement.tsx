import { useState } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
interface PushModel {
  id: string;
  name: string;
  code: string;
  protocol: string;
  linkedTypeCount: number;
  enabled: boolean;
  updatedAt: string;
}

const PUSH_MODELS: PushModel[] = [
  { id: '1', name: '标准水文数据模型', code: 'HY-STD-001', protocol: 'MQTT', linkedTypeCount: 5, enabled: true, updatedAt: '2025-10-12' },
  { id: '2', name: '气象监测推送模型', code: 'WX-PUSH-002', protocol: 'HTTP', linkedTypeCount: 3, enabled: true, updatedAt: '2025-10-08' },
  { id: '3', name: '土压力传感模型', code: 'EP-MODEL-003', protocol: 'MQTT', linkedTypeCount: 2, enabled: true, updatedAt: '2025-09-30' },
  { id: '4', name: '振弦数据标准模型', code: 'VS-STD-004', protocol: 'MQTT', linkedTypeCount: 4, enabled: false, updatedAt: '2025-09-22' },
  { id: '5', name: '水质监测推送模型', code: 'WQ-PUSH-005', protocol: 'HTTP', linkedTypeCount: 6, enabled: true, updatedAt: '2025-11-01' },
  { id: '6', name: 'SL651 水文规约模型', code: 'SL651-006', protocol: '四川水文规约', linkedTypeCount: 8, enabled: true, updatedAt: '2025-11-05' },
  { id: '7', name: '裂缝位移监测模型', code: 'CR-MODEL-007', protocol: 'MQTT', linkedTypeCount: 2, enabled: false, updatedAt: '2025-08-15' },
  { id: '8', name: '地下水位标准模型', code: 'GW-STD-008', protocol: 'HTTP', linkedTypeCount: 1, enabled: true, updatedAt: '2025-10-20' },
  { id: '9', name: '遥测终端通用模型', code: 'RTU-GEN-009', protocol: '私有协议', linkedTypeCount: 10, enabled: true, updatedAt: '2025-11-10' },
];

const STATUS_OPTIONS = ['启用状态', '已启用', '已停用'];

/* ─────────────────── shared sub-components ─────────────────── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
      style={{ width: 40, height: 20, background: enabled ? '#52C41A' : '#D9D9D9' }}
    >
      <span
        className="absolute rounded-full bg-white shadow transition-transform"
        style={{ width: 16, height: 16, transform: enabled ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

function Select({ value, options, onChange }: {
  value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[120px]"
      >
        <span className="flex-1 text-left">{value}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E8E8E8] rounded shadow-lg z-20 min-w-full"
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
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onChange(p)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors"
          style={{
            borderColor: p === current ? '#1890FF' : '#D9D9D9',
            background: p === current ? '#1890FF' : 'white',
            color: p === current ? 'white' : '#595959',
          }}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ›
      </button>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function PushModelManagement() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('启用状态');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PushModel[]>(PUSH_MODELS);

  const PAGE_SIZE = 9;
  const TOTAL = 34;

  const filtered = data.filter(item => {
    const matchKw = !keyword || item.name.includes(keyword) || item.code.includes(keyword);
    const matchStatus =
      status === '启用状态' ||
      (status === '已启用' && item.enabled) ||
      (status === '已停用' && !item.enabled);
    return matchKw && matchStatus;
  });

  const toggleEnabled = (id: string) =>
    setData(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));

  const handleReset = () => {
    setKeyword('');
    setStatus('启用状态');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="max-w-full space-y-4">

        {/* ── 搜索操作区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 h-8 px-3 border border-[#D9D9D9] rounded
              focus-within:border-[#40A9FF] focus-within:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]
              bg-white transition-all min-w-[280px]">
              <Search className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
              <input
                type="text"
                placeholder="请输入物模型名称或编码"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-[#BFBFBF] text-[#262626]"
              />
            </div>

            <Select value={status} options={STATUS_OPTIONS} onChange={setStatus} />

            <button onClick={() => setCurrentPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 查询
            </button>
            <button onClick={handleReset}
              className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                hover:text-[#1890FF] text-sm rounded bg-white transition-colors">
              重置
            </button>

            <div className="ml-auto">
              <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                transition-colors flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 0 rgba(0,0,0,0.045)' }}>
                <Plus className="w-4 h-4" />
                新增推送物模型
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
                {['物模型名称', '物模型编码', '推送协议', '关联设备数', '更新日期', '状态', '操作'].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-sm font-semibold" style={{ color: '#262626' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const isLast = idx === filtered.length - 1;
                return (
                  <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderBottom: isLast ? 'none' : '1px solid #F0F0F0' }}>

                    {/* 名称 */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#262626]">{item.name}</span>
                    </td>

                    {/* 编码 */}
                    <td className="px-4 py-3">
                      <code className="text-sm px-1.5 py-0.5 rounded"
                        style={{ fontFamily: 'SFMono-Regular, Consolas, monospace', color: '#595959', background: '#F5F5F5', border: '1px solid #E8E8E8' }}>
                        {item.code}
                      </code>
                    </td>

                    {/* 推送协议 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#595959]">{item.protocol}</span>
                    </td>

                    {/* 关联设备数 */}
                    <td className="px-4 py-3">
                      {item.linkedTypeCount > 0 ? (
                        <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors"
                          style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                          {item.linkedTypeCount} 台
                        </button>
                      ) : (
                        <span className="text-sm text-[#BFBFBF]">— 台</span>
                      )}
                    </td>

                    {/* 更新日期 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#8C8C8C]">{item.updatedAt}</span>
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <Toggle enabled={item.enabled} onChange={() => toggleEnabled(item.id)} />
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors px-1">
                          编辑
                        </button>
                        <span className="text-[#E8E8E8] text-sm">|</span>
                        <button className="text-sm text-[#FF4D4F] hover:text-[#FF7875] transition-colors px-1">
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── 底部 ── */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-xs text-[#BFBFBF]">
              注：已被设备类型关联的物模型不可删除，仅可停用。
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8C8C8C]">
                共 {TOTAL} 个模型，{currentPage} / {Math.ceil(TOTAL / PAGE_SIZE)} 页
              </span>
              <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setCurrentPage} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
