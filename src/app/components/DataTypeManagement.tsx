import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/* ─────────────────── types ─────────────────── */
interface ChildField {
  id: string;
  name: string;
  index: number;
  valueType: string;
  parseRule: string;
  matchMode: 'required' | 'optional';
  unit: string;
}

interface DataTypeRow {
  id: string;
  name: string;
  code: string;
  structure: 'basic' | 'composite';
  valueType: string;
  parseRule: string;
  matchMode: string;
  unit: string;
  children?: ChildField[];
}

/* ─────────────────── mock data ─────────────────── */
const DATA_TYPES: DataTypeRow[] = [
  {
    id: '1', name: '倾角', code: '201', structure: 'composite',
    valueType: '动态复合型 (Dynamic Array)',
    parseRule: '按 | 分割符顺序解析',
    matchMode: '变长报文：1~3参数',
    unit: '--',
    children: [
      { id: '1-0', name: '单轴/X轴倾角', index: 0, valueType: '浮点型 (Float)', parseRule: '提取第1位数据', matchMode: 'required', unit: '°' },
      { id: '1-1', name: 'Y轴倾角',      index: 1, valueType: '浮点型 (Float)', parseRule: '提取第2位数据(若存在)', matchMode: 'optional', unit: '°' },
      { id: '1-2', name: 'Z轴倾角',      index: 2, valueType: '浮点型 (Float)', parseRule: '提取第3位数据(若存在)', matchMode: 'optional', unit: '°' },
    ],
  },
  {
    id: '2', name: '裂缝位移', code: '202', structure: 'basic',
    valueType: '浮点型 (Float)',
    parseRule: '原始值 × 0.01 mm',
    matchMode: '固定单值',
    unit: 'mm',
  },
  {
    id: '3', name: '雨量', code: '203', structure: 'basic',
    valueType: '浮点型 (Float)',
    parseRule: '累计翻斗次数 × 0.2',
    matchMode: '固定单值',
    unit: 'mm',
  },
  {
    id: '4', name: '水位', code: '204', structure: 'composite',
    valueType: '动态复合型 (Dynamic Array)',
    parseRule: '按 | 分割符顺序解析',
    matchMode: '变长报文：1~2参数',
    unit: '--',
    children: [
      { id: '4-0', name: '水位高程', index: 0, valueType: '浮点型 (Float)', parseRule: '提取第1位数据', matchMode: 'required', unit: 'm' },
      { id: '4-1', name: '水温',     index: 1, valueType: '浮点型 (Float)', parseRule: '提取第2位数据(若存在)', matchMode: 'optional', unit: '℃' },
    ],
  },
  {
    id: '5', name: '土压力', code: '205', structure: 'basic',
    valueType: '浮点型 (Float)',
    parseRule: '原始值 × 系数 + 偏移量',
    matchMode: '固定单值',
    unit: 'kPa',
  },
  {
    id: '6', name: '应变', code: '206', structure: 'basic',
    valueType: '整型 (Integer)',
    parseRule: '频率模数换算',
    matchMode: '固定单值',
    unit: 'με',
  },
  {
    id: '7', name: '风速风向', code: '207', structure: 'composite',
    valueType: '固定复合型 (Fixed Struct)',
    parseRule: '按位域解析',
    matchMode: '固定双值',
    unit: '--',
    children: [
      { id: '7-0', name: '风速', index: 0, valueType: '浮点型 (Float)', parseRule: '提取第1位数据', matchMode: 'required', unit: 'm/s' },
      { id: '7-1', name: '风向', index: 1, valueType: '浮点型 (Float)', parseRule: '提取第2位数据', matchMode: 'required', unit: '°' },
    ],
  },
  {
    id: '8', name: '温湿度', code: '208', structure: 'composite',
    valueType: '固定复合型 (Fixed Struct)',
    parseRule: '按 , 分割符解析',
    matchMode: '固定双值',
    unit: '--',
    children: [
      { id: '8-0', name: '温度', index: 0, valueType: '浮点型 (Float)', parseRule: '提取第1位数据', matchMode: 'required', unit: '℃' },
      { id: '8-1', name: '湿度', index: 1, valueType: '浮点型 (Float)', parseRule: '提取第2位数据', matchMode: 'required', unit: '%RH' },
    ],
  },
  {
    id: '9', name: '电池电压', code: '301', structure: 'basic',
    valueType: '浮点型 (Float)',
    parseRule: '原始值 × 0.001',
    matchMode: '固定单值',
    unit: 'V',
  },
];

const STRUCTURE_OPTIONS = ['数据结构（全部）', '基础型', '复合型'];

/* ─────────────────── small components ─────────────────── */

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="h-8 px-3 border border-[#D9D9D9] rounded text-sm text-[#595959] bg-white
          hover:border-[#40A9FF] transition-colors flex items-center gap-1.5 min-w-[160px]"
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
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ‹
      </button>
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
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        ›
      </button>
    </div>
  );
}

/* value type tag */
function ValueTypeTag({ label, kind }: { label: string; kind: 'composite' | 'float' | 'int' | 'other' }) {
  const styles = {
    composite: { color: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
    float:     { color: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
    int:       { color: '#006D75', bg: '#E6FFFB', border: '#87E8DE' },
    other:     { color: '#595959', bg: '#F5F5F5', border: '#D9D9D9' },
  }[kind];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap"
      style={{ color: styles.color, background: styles.bg, borderColor: styles.border }}>
      {label}
    </span>
  );
}

function valueTypeKind(vt: string): 'composite' | 'float' | 'int' | 'other' {
  if (vt.includes('复合')) return 'composite';
  if (vt.includes('Float') || vt.includes('浮点')) return 'float';
  if (vt.includes('Integer') || vt.includes('整型')) return 'int';
  return 'other';
}

/* match mode tag for root rows */
function RootMatchTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border whitespace-nowrap"
      style={{ color: '#D46B08', background: '#FFF7E6', borderColor: '#FFD591' }}>
      {label}
    </span>
  );
}

/* match mode tag for child rows */
function ChildMatchTag({ mode }: { mode: 'required' | 'optional' }) {
  if (mode === 'required') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border whitespace-nowrap"
        style={{ color: '#CF1322', background: '#FFF1F0', borderColor: '#FFA39E' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4F] flex-shrink-0" />
        必填 (Required)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs border whitespace-nowrap"
      style={{ color: '#8C8C8C', background: '#FAFAFA', borderColor: '#D9D9D9' }}>
      选填 (Optional)
    </span>
  );
}

/* root code badge */
function RootCodeBadge({ code }: { code: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold"
      style={{ background: '#1890FF', color: '#fff', letterSpacing: '0.04em' }}>
      {code}
    </span>
  );
}

/* child index badge */
function ChildIndexBadge({ index }: { index: number }) {
  return (
    <code className="text-xs px-1.5 py-0.5 rounded"
      style={{
        fontFamily: 'SFMono-Regular, Consolas, monospace',
        color: '#8C8C8C', background: '#F5F5F5', border: '1px solid #E8E8E8',
      }}>
      Index: {index}
    </code>
  );
}

/* expand toggle button */
function ExpandBtn({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-[#E6F7FF] flex-shrink-0"
      style={{ border: '1.5px solid #1890FF', color: '#1890FF' }}>
      <span className="text-xs font-bold leading-none">{expanded ? '−' : '+'}</span>
    </button>
  );
}

/* ─────────────────── table row components ─────────────────── */
function RootRow({ row, expanded, onToggle }: { row: DataTypeRow; expanded: boolean; onToggle: () => void }) {
  const hasChildren = !!row.children?.length;
  return (
    <tr className="hover:bg-[#FAFAFA] transition-colors" style={{ borderBottom: '1px solid #F0F0F0' }}>
      {/* expand */}
      <td className="px-3 py-3 w-10">
        {hasChildren ? <ExpandBtn expanded={expanded} onClick={onToggle} /> : null}
      </td>
      {/* name */}
      <td className="px-3 py-3">
        <span className="text-sm font-semibold text-[#262626]">{row.name}</span>
      </td>
      {/* code */}
      <td className="px-3 py-3">
        <RootCodeBadge code={row.code} />
      </td>
      {/* value type */}
      <td className="px-3 py-3">
        <ValueTypeTag label={row.valueType} kind={valueTypeKind(row.valueType)} />
      </td>
      {/* parse rule */}
      <td className="px-3 py-3">
        <span className="text-xs text-[#8C8C8C]">{row.parseRule}</span>
      </td>
      {/* match mode */}
      <td className="px-3 py-3">
        <RootMatchTag label={row.matchMode} />
      </td>
      {/* unit */}
      <td className="px-3 py-3 text-sm text-[#8C8C8C]">{row.unit}</td>
      {/* ops */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-0.5 whitespace-nowrap">
          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">编辑</button>
          <span className="text-[#D9D9D9] text-xs">|</span>
          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">增加字段</button>
          <span className="text-[#D9D9D9] text-xs">|</span>
          <button className="text-xs text-[#FF4D4F] hover:text-[#FF7875] px-1 transition-colors">删除</button>
        </div>
      </td>
    </tr>
  );
}

function ChildRow({ field, isLast }: { field: ChildField; isLast: boolean }) {
  return (
    <tr className="hover:bg-[#F0F7FF] transition-colors"
      style={{ background: '#FAFCFF', borderBottom: isLast ? '2px solid #E8E8E8' : '1px solid #F0F0F0' }}>
      {/* expand placeholder */}
      <td className="px-3 py-2.5 w-10" />
      {/* name with tree indent */}
      <td className="py-2.5" style={{ paddingLeft: 28 }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[#BFBFBF] text-xs select-none flex-shrink-0" style={{ fontFamily: 'monospace' }}>
            {isLast ? '└─' : '├─'}
          </span>
          <span className="text-sm text-[#434343]">{field.name}</span>
        </div>
      </td>
      {/* index */}
      <td className="px-3 py-2.5">
        <ChildIndexBadge index={field.index} />
      </td>
      {/* value type */}
      <td className="px-3 py-2.5">
        <ValueTypeTag label={field.valueType} kind={valueTypeKind(field.valueType)} />
      </td>
      {/* parse rule */}
      <td className="px-3 py-2.5">
        <span className="text-xs text-[#8C8C8C]">{field.parseRule}</span>
      </td>
      {/* match mode */}
      <td className="px-3 py-2.5">
        <ChildMatchTag mode={field.matchMode} />
      </td>
      {/* unit */}
      <td className="px-3 py-2.5 text-sm text-[#595959]">{field.unit}</td>
      {/* ops */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-0.5 whitespace-nowrap">
          <button className="text-xs text-[#1890FF] hover:text-[#40A9FF] px-1 transition-colors">编辑</button>
          <span className="text-[#D9D9D9] text-xs">|</span>
          <button className="text-xs text-[#FF4D4F] hover:text-[#FF7875] px-1 transition-colors">删除</button>
        </div>
      </td>
    </tr>
  );
}


/* ─────────────────── main page ─────────────────── */
export function DataTypeManagement() {
  const [keyword, setKeyword]     = useState('');
  const [structure, setStructure] = useState('数据结构（全部）');
  const [currentPage, setPage]    = useState(1);
  const [expanded, setExpanded]   = useState<Set<string>>(new Set(['1']));

  const TOTAL = 45;
  const PAGE_SIZE = 9;

  const filtered = DATA_TYPES.filter(row => {
    const matchKw = !keyword || row.name.includes(keyword) || row.code.includes(keyword);
    const matchStr =
      structure === '数据结构（全部）' ||
      (structure === '复合型' && row.structure === 'composite') ||
      (structure === '基础型' && row.structure === 'basic');
    return matchKw && matchStr;
  });

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-[#F0F2F5] p-6">
      <div className="space-y-4">

        {/* ── 顶部搜索区 ── */}
        <div className="bg-white rounded-lg border border-[#E8E8E8] px-6 py-4"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="flex items-center gap-3 flex-wrap">
            {/* 搜索框 */}
            <div className="flex items-center gap-2 h-8 px-3 border border-[#D9D9D9] rounded
              focus-within:border-[#40A9FF] focus-within:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]
              bg-white transition-all" style={{ minWidth: 260 }}>
              <Search className="w-3.5 h-3.5 text-[#BFBFBF] flex-shrink-0" />
              <input
                type="text"
                placeholder="搜索数据类型或标识码"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(1); }}
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-[#BFBFBF] text-[#262626]"
              />
            </div>

            {/* 数据结构下拉 */}
            <Select value={structure} options={STRUCTURE_OPTIONS} onChange={v => { setStructure(v); setPage(1); }} />

            {/* 查询按钮 */}
            <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
              🔍 查询
            </button>

            {/* 新增按钮 (靠右) */}
            <div className="ml-auto">
              <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                transition-colors flex items-center gap-1.5"
                style={{ boxShadow: '0 2px 0 rgba(0,0,0,0.045)' }}>
                <span className="text-base leading-none">⊕</span>
                新增数据类型
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
                <th className="w-10 px-3 py-3" />
                {['数据类型', '数据标识码 / 索引', '值类型', '解析规则', '匹配模式', '单位', '操作'].map(col => (
                  <th key={col} className="px-3 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.flatMap(row => {
                const isExpanded = expanded.has(row.id);
                const hasChildren = !!row.children?.length;
                const rows = [
                  <RootRow key={row.id} row={row} expanded={isExpanded} onToggle={() => toggleExpand(row.id)} />,
                ];
                if (hasChildren && isExpanded) {
                  row.children!.forEach((child, idx) => {
                    rows.push(
                      <ChildRow key={child.id} field={child} isLast={idx === row.children!.length - 1} />
                    );
                  });
                }
                return rows;
              })}
            </tbody>
          </table>

          {/* ── 底部分页 ── */}
          <div className="px-4 py-3 flex items-center justify-end gap-4 border-t border-[#F0F0F0]"
            style={{ background: '#FAFAFA' }}>
            <span className="text-sm text-[#8C8C8C]">
              共 {TOTAL} 种标准数据类型，{currentPage} / {Math.ceil(TOTAL / PAGE_SIZE)} 页
            </span>
            <Pagination
              current={currentPage}
              total={TOTAL}
              pageSize={PAGE_SIZE}
              onChange={setPage}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
