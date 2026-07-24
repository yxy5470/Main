import { useState } from 'react';
import { Plus, Search, ChevronDown, Play, Square, RefreshCw } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
type PushStatus = 'running' | 'stopped' | 'error' | 'pending';

interface PushConfig {
  id: string;
  name: string;
  modelCode: string;
  modelName: string;
  protocol: string;
  endpoint: string;
  deviceCount: number;
  status: PushStatus;
  lastPushAt: string | null;
}

const PUSH_CONFIGS: PushConfig[] = [
  { id: '1', name: '成都水文站数据推送', modelCode: 'HY-STD-001', modelName: '标准水文数据模型', protocol: 'MQTT', endpoint: 'mqtt://broker.example.com:1883/hydro/chengdu', deviceCount: 32, status: 'running', lastPushAt: '2025-11-20 14:35:02' },
  { id: '2', name: '气象监测实时上报', modelCode: 'WX-PUSH-002', modelName: '气象监测推送模型', protocol: 'HTTP', endpoint: 'https://api.weather.example.com/v2/push', deviceCount: 18, status: 'running', lastPushAt: '2025-11-20 14:34:58' },
  { id: '3', name: '土压力传感器推送', modelCode: 'EP-MODEL-003', modelName: '土压力传感模型', protocol: 'MQTT', endpoint: 'mqtt://broker.example.com:1883/sensor/ep', deviceCount: 7, status: 'stopped', lastPushAt: '2025-11-19 09:12:44' },
  { id: '4', name: '振弦应变数据同步', modelCode: 'VS-STD-004', modelName: '振弦数据标准模型', protocol: 'MQTT', endpoint: 'mqtt://broker.example.com:1883/sensor/vs', deviceCount: 12, status: 'error', lastPushAt: '2025-11-20 11:08:33' },
  { id: '5', name: '水质在线监测推送', modelCode: 'WQ-PUSH-005', modelName: '水质监测推送模型', protocol: 'HTTP', endpoint: 'https://api.water.example.com/quality/upload', deviceCount: 24, status: 'running', lastPushAt: '2025-11-20 14:35:10' },
  { id: '6', name: 'SL651 规约数据上报', modelCode: 'SL651-006', modelName: 'SL651 水文规约模型', protocol: '四川水文规约', endpoint: '122.8.xx.xx:8088', deviceCount: 45, status: 'running', lastPushAt: '2025-11-20 14:34:50' },
  { id: '7', name: '地下水位数据同步', modelCode: 'GW-STD-008', modelName: '地下水位标准模型', protocol: 'HTTP', endpoint: 'https://api.groundwater.example.com/level', deviceCount: 6, status: 'pending', lastPushAt: null },
  { id: '8', name: '遥测终端通用上报', modelCode: 'RTU-GEN-009', modelName: '遥测终端通用模型', protocol: '私有协议', endpoint: '192.168.10.88:9000', deviceCount: 63, status: 'running', lastPushAt: '2025-11-20 14:35:05' },
];

const STATUS_CONFIG: Record<PushStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  running: { label: '推送中', text: '#389E0D', bg: '#F6FFED', border: '#B7EB8F', dot: '#52C41A' },
  stopped: { label: '已停止', text: '#595959', bg: '#F5F5F5', border: '#D9D9D9', dot: '#8C8C8C' },
  error:   { label: '异常',   text: '#CF1322', bg: '#FFF1F0', border: '#FFA39E', dot: '#F5222D' },
  pending: { label: '待启动', text: '#D46B08', bg: '#FFF7E6', border: '#FFD591', dot: '#FA8C16' },
};

const PROTOCOL_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  'MQTT':       { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  'HTTP':       { text: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  '私有协议':    { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  '四川水文规约': { text: '#006D75', bg: '#E6FFFB', border: '#87E8DE' },
};

const STATUS_OPTIONS = ['全部状态', '推送中', '已停止', '异常', '待启动'];

/* ─────────────────── sub-components ─────────────────── */
function StatusBadge({ status }: { status: PushStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: c.text, background: c.bg, borderColor: c.border }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function ProtocolTag({ value }: { value: string }) {
  const s = PROTOCOL_STYLE[value] ?? { text: '#595959', bg: '#F5F5F5', border: '#D9D9D9' };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
      style={{ color: s.text, background: s.bg, borderColor: s.border }}>
      {value}
    </span>
  );
}


function Select({ value, options, onChange }: {
  value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[110px]">
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
export function DataPush() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<PushConfig[]>(PUSH_CONFIGS);

  const PAGE_SIZE = 9;
  const TOTAL = 26;

  const filtered = data.filter(item => {
    const matchKw = !keyword || item.name.includes(keyword) || item.modelCode.includes(keyword) || item.modelName.includes(keyword);
    const matchStatus =
      statusFilter === '全部状态' ||
      STATUS_CONFIG[item.status].label === statusFilter;
    return matchKw && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setData(prev => prev.map(item => {
      if (item.id !== id) return item;
      const next: PushStatus = item.status === 'running' ? 'stopped'
        : item.status === 'stopped' || item.status === 'pending' ? 'running'
        : item.status;
      return { ...item, status: next };
    }));
  };

  const handleReset = () => {
    setKeyword('');
    setStatusFilter('全部状态');
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
                placeholder="请输入推送名称或物模型编码/名称"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-[#BFBFBF] text-[#262626]"
              />
            </div>

            <Select value={statusFilter} options={STATUS_OPTIONS} onChange={setStatusFilter} />

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
                新增推送配置
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
                {['推送名称', '关联物模型', '推送协议', '目标端点', '关联设备数', '最近推送时间', '状态', '操作'].map(col => (
                  <th key={col} className="text-left px-4 py-3 text-sm font-semibold whitespace-nowrap" style={{ color: '#262626' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const isLast = idx === filtered.length - 1;
                const canToggle = item.status !== 'error';
                return (
                  <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderBottom: isLast ? 'none' : '1px solid #F0F0F0' }}>

                    {/* 推送名称 */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#262626]">{item.name}</span>
                    </td>

                    {/* 关联物模型 */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-[#262626]">{item.modelName}</span>
                        <code className="text-xs px-1 py-0.5 rounded self-start"
                          style={{ fontFamily: 'SFMono-Regular, Consolas, monospace', color: '#8C8C8C', background: '#F5F5F5', border: '1px solid #E8E8E8' }}>
                          {item.modelCode}
                        </code>
                      </div>
                    </td>

                    {/* 推送协议 */}
                    <td className="px-4 py-3">
                      <ProtocolTag value={item.protocol} />
                    </td>

                    {/* 目标端点 */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className="text-xs text-[#595959] font-mono break-all leading-relaxed">
                        {item.endpoint}
                      </span>
                    </td>

                    {/* 关联设备数 */}
                    <td className="px-4 py-3">
                      <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors"
                        style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                        {item.deviceCount} 台
                      </button>
                    </td>

                    {/* 最近推送时间 */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.lastPushAt
                        ? <span className="text-sm text-[#8C8C8C]">{item.lastPushAt}</span>
                        : <span className="text-sm text-[#BFBFBF]">—</span>}
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5 whitespace-nowrap">
                        {/* 启动/停止 */}
                        {item.status === 'running' ? (
                          <button onClick={() => toggleStatus(item.id)}
                            className="inline-flex items-center gap-1 text-sm text-[#FA8C16] hover:text-[#FFA940] transition-colors px-1">
                            <Square className="w-3 h-3" />停止
                          </button>
                        ) : canToggle ? (
                          <button onClick={() => toggleStatus(item.id)}
                            className="inline-flex items-center gap-1 text-sm text-[#52C41A] hover:text-[#73D13D] transition-colors px-1">
                            <Play className="w-3 h-3" />启动
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1 text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors px-1">
                            <RefreshCw className="w-3 h-3" />重试
                          </button>
                        )}
                        <span className="text-[#E8E8E8] text-sm">|</span>
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
              注：推送异常时请检查目标端点连通性，或前往推送物模型确认字段映射。
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8C8C8C]">
                共 {TOTAL} 条配置，{currentPage} / {Math.ceil(TOTAL / PAGE_SIZE)} 页
              </span>
              <Pagination current={currentPage} total={TOTAL} pageSize={PAGE_SIZE} onChange={setCurrentPage} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
