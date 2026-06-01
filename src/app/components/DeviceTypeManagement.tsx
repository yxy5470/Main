import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/* ─────────────────── types & data ─────────────────── */
interface DeviceType {
  id: string;
  thumbnail: string;
  name: string;
  code: string;
  category: string;
  categoryColor: 'blue' | 'orange' | 'green' | 'purple';
  protocol: string;
  deviceCount: number;
  enabled: boolean;
}

const DEVICE_TYPES: DeviceType[] = [
  {
    id: '1', thumbnail: '', name: '多参数裂缝倾角计', code: 'SE200',
    category: '物联网传感器', categoryColor: 'blue', protocol: 'MQTT',
    deviceCount: 1245, enabled: true,
  },
  {
    id: '2', thumbnail: '', name: '遥测终端机', code: 'CR120',
    category: '遥测终端', categoryColor: 'orange', protocol: '私有协议',
    deviceCount: 42, enabled: true,
  },
  {
    id: '3', thumbnail: '', name: '雨量计', code: 'RG100',
    category: '气象传感器', categoryColor: 'green', protocol: 'MQTT',
    deviceCount: 318, enabled: true,
  },
  {
    id: '4', thumbnail: '', name: '水位传感器', code: 'WL300',
    category: '水文传感器', categoryColor: 'purple', protocol: 'Modbus',
    deviceCount: 207, enabled: false,
  },
  {
    id: '5', thumbnail: '', name: '振弦式应变计', code: 'VS410',
    category: '物联网传感器', categoryColor: 'blue', protocol: 'MQTT',
    deviceCount: 893, enabled: true,
  },
  {
    id: '6', thumbnail: '', name: '土压力传感器', code: 'EP220',
    category: '物联网传感器', categoryColor: 'blue', protocol: 'MQTT',
    deviceCount: 156, enabled: true,
  },
  {
    id: '7', thumbnail: '', name: '风速风向仪', code: 'WS500',
    category: '气象传感器', categoryColor: 'green', protocol: 'RS485',
    deviceCount: 74, enabled: false,
  },
  {
    id: '8', thumbnail: '', name: '地下水位计', code: 'GW610',
    category: '水文传感器', categoryColor: 'purple', protocol: 'Modbus',
    deviceCount: 429, enabled: true,
  },
  {
    id: '9', thumbnail: '', name: '位移传感器', code: 'DS180',
    category: '物联网传感器', categoryColor: 'blue', protocol: 'MQTT',
    deviceCount: 561, enabled: true,
  },
];

const TAG_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  blue:   { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  orange: { text: '#AD4E00', bg: '#FFF7E6', border: '#FFD591' },
  green:  { text: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  purple: { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
};

const CATEGORIES = ['全部大类', '物联网传感器', '遥测终端', '气象传感器', '水文传感器'];
const STATUS_OPTIONS = ['启用状态', '已启用', '已停用'];

/* ─────────────────── thumbnail placeholder ─────────────────── */
function DeviceThumbnail() {
  return (
    <div
      className="w-10 h-10 rounded-md border flex items-center justify-center flex-shrink-0"
      style={{ borderColor: '#E8E8E8', background: '#FAFAFA' }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="12" rx="2" stroke="#BFBFBF" strokeWidth="1.4" />
        <circle cx="7" cy="11" r="2" stroke="#BFBFBF" strokeWidth="1.2" />
        <path d="M12 9h5M12 11h4M12 13h3" stroke="#BFBFBF" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─────────────────── toggle switch ─────────────────── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
      style={{
        width: 40, height: 20,
        background: enabled ? '#52C41A' : '#D9D9D9',
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow transition-transform"
        style={{
          width: 16, height: 16,
          transform: enabled ? 'translateX(22px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

/* ─────────────────── select ─────────────────── */
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
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-[#F5F5F5] transition-colors"
              style={{ color: opt === value ? '#1890FF' : '#262626' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── pagination ─────────────────── */
function Pagination({ current, total, pageSize, onChange }: {
  current: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >‹</button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm transition-colors"
          style={{
            borderColor: p === current ? '#1890FF' : '#D9D9D9',
            background: p === current ? '#1890FF' : 'white',
            color: p === current ? 'white' : '#595959',
          }}
        >{p}</button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, current + 1))}
        disabled={current === totalPages}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >›</button>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function DeviceTypeManagement() {
  const [keyword, setKeyword]     = useState('');
  const [category, setCategory]   = useState('全部大类');
  const [status, setStatus]       = useState('启用状态');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData]           = useState<DeviceType[]>(DEVICE_TYPES);

  const PAGE_SIZE = 9;
  const TOTAL = 36;

  const filteredData = data.filter(item => {
    const matchKeyword = !keyword || item.name.includes(keyword) || item.code.includes(keyword);
    const matchCategory = category === '全部大类' || item.category === category;
    const matchStatus =
      status === '启用状态' ||
      (status === '已启用' && item.enabled) ||
      (status === '已停用' && !item.enabled);
    return matchKeyword && matchCategory && matchStatus;
  });

  const toggleEnabled = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('全部大类');
    setStatus('启用状态');
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="max-w-full space-y-4">

        {/* ── 搜索与操作区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 关键词搜索 */}
            <div className="flex items-center gap-2 h-8 px-3 border border-[#D9D9D9] rounded
              focus-within:border-[#40A9FF] focus-within:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]
              bg-white transition-all min-w-[280px]">
              <Search className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
              <input
                type="text"
                placeholder="请输入设备类型名称或编码"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-[#BFBFBF] text-[#262626]"
              />
            </div>

            {/* 大类下拉 */}
            <Select value={category} options={CATEGORIES} onChange={setCategory} />

            {/* 状态下拉 */}
            <Select value={status} options={STATUS_OPTIONS} onChange={setStatus} />

            {/* 查询 + 重置 */}
            <button
              onClick={() => setCurrentPage(1)}
              className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors"
            >
              🔍 查询
            </button>
            <button
              onClick={handleReset}
              className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                hover:text-[#1890FF] text-sm rounded bg-white transition-colors"
            >
              重置
            </button>

            {/* 新增按钮（靠右） */}
            <div className="ml-auto">
              <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                transition-colors flex items-center gap-1.5 shadow-sm"
                style={{ boxShadow: '0 2px 0 rgba(0,0,0,0.045)' }}>
                <span className="text-base leading-none">⊕</span>
                新增设备类型
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
                {['设备缩略图', '设备类型名称', '类型编码', '所属分类', '接入协议', '关联设备数', '状态', '操作'].map(col => (
                  <th key={col}
                    className="text-left px-4 py-3 text-sm font-semibold"
                    style={{ color: '#262626' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const tc = TAG_STYLE[item.categoryColor];
                const isLast = idx === filteredData.length - 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAFAFA] transition-colors"
                    style={{ borderBottom: isLast ? 'none' : '1px solid #F0F0F0' }}
                  >
                    {/* 缩略图 */}
                    <td className="px-4 py-3">
                      <DeviceThumbnail />
                    </td>

                    {/* 名称 */}
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#262626]">{item.name}</span>
                    </td>

                    {/* 编码 */}
                    <td className="px-4 py-3">
                      <code
                        className="text-sm px-1.5 py-0.5 rounded"
                        style={{
                          fontFamily: 'SFMono-Regular, Consolas, monospace',
                          color: '#595959',
                          background: '#F5F5F5',
                          border: '1px solid #E8E8E8',
                        }}
                      >{item.code}</code>
                    </td>

                    {/* 分类 */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                        style={{ color: tc.text, background: tc.bg, borderColor: tc.border }}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* 协议 */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#595959]">{item.protocol}</span>
                    </td>

                    {/* 关联设备数 */}
                    <td className="px-4 py-3">
                      {item.deviceCount > 0 ? (
                        <button
                          className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors"
                          style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
                        >
                          {item.deviceCount.toLocaleString()} 台
                        </button>
                      ) : (
                        <span className="text-sm text-[#BFBFBF]">— 台</span>
                      )}
                    </td>

                    {/* 状态 */}
                    <td className="px-4 py-3">
                      <Toggle enabled={item.enabled} onChange={() => toggleEnabled(item.id)} />
                    </td>

                    {/* 操作 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors px-1">
                          ⚙️ 物模型配置
                        </button>
                        <span className="text-[#E8E8E8] text-sm">|</span>
                        <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors px-1 flex items-center gap-0.5">
                          更多 <span className="text-xs">▾</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ── 底部区域 ── */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-xs text-[#BFBFBF]">
              注：已被设备实例关联的类型不可被物理删除，仅可停用。
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8C8C8C]">
                共 {TOTAL} 种类型，{currentPage} / {Math.ceil(TOTAL / PAGE_SIZE)} 页
              </span>
              <Pagination
                current={currentPage}
                total={TOTAL}
                pageSize={PAGE_SIZE}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
