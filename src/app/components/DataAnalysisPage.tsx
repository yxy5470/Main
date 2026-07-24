import { useState, useRef, useEffect } from 'react';
import {
  Network, Grid3x3, List,
  Search, X, ChevronDown, ChevronRight, FolderOpen, MapPin,
  AlertTriangle, Star, ExternalLink, Building2, Check,
} from 'lucide-react';

/* ─────────────────── types ─────────────────── */
type ViewMode = 'grid' | 'list';

interface Metric {
  k: string;
  code: string;
  v: string;
  unit: string;
  alert: boolean;
}

interface Device {
  id: number;
  locationName: string;
  sn: string;
  imei: string;
  status: 'online' | 'offline';
  hasAlert: boolean;
  volt: string;
  temp: string;
  humi: string;
  project: string;
  updated: string;
  metrics: Metric[];
}

type TreeNodeDef = {
  id: string;
  label: string;
  type: 'org' | 'project' | 'device';
  children?: TreeNodeDef[];
};

/* ─────────────────── mock data ─────────────────── */
const DEVICES: Device[] = [
  {
    id: 1, locationName: '主干渠1号', sn: 'CR120251120001', imei: '868381079719402',
    status: 'online', hasAlert: false, volt: '12.5V', temp: '22℃', humi: '45%',
    project: '成都市水文监测', updated: '2025-11-20 14:32',
    metrics: [
      { k: '水位', code: 'WL01', v: '2.1', unit: 'm', alert: false },
      { k: '水压', code: 'WP01', v: '1.2', unit: 'MPa', alert: false },
      { k: '流量', code: 'FL01', v: '15', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '0', unit: 'mm', alert: false },
      { k: '浊度', code: 'TB01', v: '12', unit: 'NTU', alert: false },
      { k: 'PH值', code: 'PH01', v: '7.2', unit: '', alert: false },
    ],
  },
  {
    id: 2, locationName: '闸口流量站', sn: 'CR120251120010', imei: '868381079719415',
    status: 'online', hasAlert: true, volt: '12.3V', temp: '20℃', humi: '55%',
    project: '成都市水文监测', updated: '2025-11-20 14:33',
    metrics: [
      { k: '水位', code: 'WL01', v: '4.2', unit: 'm', alert: true },
      { k: '水压', code: 'WP01', v: '1.8', unit: 'MPa', alert: false },
      { k: '流量', code: 'FL01', v: '42', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '5', unit: 'mm', alert: false },
      { k: '浊度', code: 'TB01', v: '35', unit: 'NTU', alert: true },
      { k: '水温', code: 'WT01', v: '18', unit: '℃', alert: false },
    ],
  },
  {
    id: 3, locationName: '支渠A01', sn: 'CR120251120005', imei: '868381079719408',
    status: 'offline', hasAlert: false, volt: '—', temp: '—', humi: '—',
    project: '成都市水文监测', updated: '2025-11-19 08:10',
    metrics: [
      { k: '水位', code: 'WL01', v: '—', unit: '', alert: false },
      { k: '水压', code: 'WP01', v: '—', unit: '', alert: false },
      { k: '流量', code: 'FL01', v: '—', unit: '', alert: false },
      { k: '雨量', code: 'RL01', v: '—', unit: '', alert: false },
      { k: '浊度', code: 'TB01', v: '—', unit: '', alert: false },
      { k: '电导率', code: 'EC01', v: '—', unit: '', alert: false },
    ],
  },
  {
    id: 4, locationName: '主干渠2号', sn: 'CR120251120002', imei: '868381079719403',
    status: 'online', hasAlert: false, volt: '11.8V', temp: '23℃', humi: '47%',
    project: '成都市水文监测', updated: '2025-11-20 14:31',
    metrics: [
      { k: '水位', code: 'WL01', v: '1.8', unit: 'm', alert: false },
      { k: '水压', code: 'WP01', v: '1.0', unit: 'MPa', alert: false },
      { k: '流量', code: 'FL01', v: '12', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '2', unit: 'mm', alert: false },
      { k: '浊度', code: 'TB01', v: '15', unit: 'NTU', alert: false },
      { k: '溶解氧', code: 'DO01', v: '8.1', unit: 'mg/L', alert: false },
    ],
  },
  {
    id: 5, locationName: '泵站监测点', sn: 'CR120251120008', imei: '868381079719411',
    status: 'online', hasAlert: false, volt: '12.1V', temp: '25℃', humi: '60%',
    project: '成都市水文监测', updated: '2025-11-20 14:29',
    metrics: [
      { k: '水位', code: 'WL01', v: '3.5', unit: 'm', alert: false },
      { k: '水压', code: 'WP01', v: '2.0', unit: 'MPa', alert: false },
      { k: '流量', code: 'FL01', v: '28', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '0', unit: 'mm', alert: false },
      { k: '温度', code: 'TM01', v: '25', unit: '℃', alert: false },
      { k: '溶解氧', code: 'DO01', v: '7.8', unit: 'mg/L', alert: false },
    ],
  },
  {
    id: 6, locationName: '蓄水池B区', sn: 'CR120251120012', imei: '868381079719418',
    status: 'offline', hasAlert: false, volt: '—', temp: '—', humi: '—',
    project: '成都市水文监测', updated: '2025-11-18 22:05',
    metrics: [
      { k: '水位', code: 'WL01', v: '—', unit: '', alert: false },
      { k: '水压', code: 'WP01', v: '—', unit: '', alert: false },
      { k: '流量', code: 'FL01', v: '—', unit: '', alert: false },
      { k: '雨量', code: 'RL01', v: '—', unit: '', alert: false },
      { k: '浊度', code: 'TB01', v: '—', unit: '', alert: false },
      { k: 'PH值', code: 'PH01', v: '—', unit: '', alert: false },
    ],
  },
  {
    id: 7, locationName: '北干渠节制闸', sn: 'CR120251120018', imei: '868381079719422',
    status: 'online', hasAlert: false, volt: '12.0V', temp: '19℃', humi: '52%',
    project: '成都市水文监测', updated: '2025-11-20 14:30',
    metrics: [
      { k: '水位', code: 'WL01', v: '1.5', unit: 'm', alert: false },
      { k: '流量', code: 'FL01', v: '8', unit: 'm³/h', alert: false },
      { k: '浊度', code: 'TB01', v: '9', unit: 'NTU', alert: false },
      { k: '雨量', code: 'RL01', v: '1', unit: 'mm', alert: false },
      { k: 'PH值', code: 'PH01', v: '7.0', unit: '', alert: false },
      { k: '溶解氧', code: 'DO01', v: '9.2', unit: 'mg/L', alert: false },
    ],
  },
  {
    id: 8, locationName: '南渠排水站', sn: 'CR120251120021', imei: '868381079719425',
    status: 'online', hasAlert: true, volt: '11.5V', temp: '24℃', humi: '61%',
    project: '成都市水文监测', updated: '2025-11-20 14:28',
    metrics: [
      { k: '水位', code: 'WL01', v: '5.1', unit: 'm', alert: true },
      { k: '流量', code: 'FL01', v: '67', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '12', unit: 'mm', alert: false },
      { k: '浊度', code: 'TB01', v: '22', unit: 'NTU', alert: false },
      { k: '水温', code: 'WT01', v: '21', unit: '℃', alert: false },
      { k: '溶解氧', code: 'DO01', v: '6.5', unit: 'mg/L', alert: false },
    ],
  },
  {
    id: 9, locationName: '东干渠进水口', sn: 'CR120251120025', imei: '868381079719430',
    status: 'online', hasAlert: false, volt: '12.4V', temp: '21℃', humi: '48%',
    project: '成都市水文监测', updated: '2025-11-20 14:34',
    metrics: [
      { k: '水位', code: 'WL01', v: '2.8', unit: 'm', alert: false },
      { k: '水压', code: 'WP01', v: '1.5', unit: 'MPa', alert: false },
      { k: '流量', code: 'FL01', v: '19', unit: 'm³/h', alert: false },
      { k: '雨量', code: 'RL01', v: '0', unit: 'mm', alert: false },
      { k: '电导率', code: 'EC01', v: '420', unit: 'μS/cm', alert: false },
      { k: 'PH值', code: 'PH01', v: '7.4', unit: '', alert: false },
    ],
  },
];

/* Expand to one row per metric for list view */
const TABLE_ROWS = DEVICES.flatMap(d =>
  d.metrics.map((m, mi) => ({
    deviceId: d.id,
    isFirst: mi === 0,
    isLast: mi === d.metrics.length - 1,
    locationName: d.locationName,
    sn: d.sn,
    imei: d.imei,
    dataType: `${m.k}（${m.code}）`,
    dataValue: m.v === '—' ? '—' : `${m.v}${m.unit}`,
    updated: d.updated,
    alert: m.alert,
    offline: d.status === 'offline',
  }))
);

const TREE: TreeNodeDef[] = [{
  id: 'org-1', label: '测艺科技', type: 'org',
  children: [
    {
      id: 'proj-1', label: '成都子项目', type: 'project',
      children: [
        { id: 'dev-1', label: '主干渠1号',    type: 'device' },
        { id: 'dev-2', label: '闸口流量站',   type: 'device' },
        { id: 'dev-3', label: '支渠A01',      type: 'device' },
        { id: 'dev-4', label: '主干渠2号',    type: 'device' },
        { id: 'dev-5', label: '泵站监测点',   type: 'device' },
        { id: 'dev-6', label: '蓄水池B区',    type: 'device' },
        { id: 'dev-7', label: '北干渠节制闸', type: 'device' },
        { id: 'dev-8', label: '南渠排水站',   type: 'device' },
        { id: 'dev-9', label: '东干渠进水口', type: 'device' },
      ],
    },
    {
      id: 'proj-2', label: '绵阳子项目', type: 'project',
      children: [{ id: 'dev-10', label: '监测站B1', type: 'device' }],
    },
  ],
}];

/* ─────────────────── tree select dropdown ─────────────────── */
type NodeType = 'org' | 'project' | 'device';

function nodeIcon(type: NodeType, selected: boolean) {
  const base = 'w-3.5 h-3.5 flex-shrink-0';
  if (type === 'org')     return <Building2 className={`${base} ${selected ? 'text-white' : 'text-blue-400'}`} />;
  if (type === 'project') return <FolderOpen className={`${base} ${selected ? 'text-white' : 'text-amber-500'}`} />;
  return                         <MapPin    className={`${base} ${selected ? 'text-white' : 'text-slate-400'}`} />;
}

function flattenTree(nodes: TreeNodeDef[], query: string): TreeNodeDef[] {
  const q = query.toLowerCase();
  const results: TreeNodeDef[] = [];
  function walk(n: TreeNodeDef) {
    if (n.label.toLowerCase().includes(q)) results.push(n);
    n.children?.forEach(walk);
  }
  nodes.forEach(walk);
  return results;
}

function TreeDropdownNode({
  node, depth, selectedId, expandedIds, onSelect, onToggle,
}: {
  node: TreeNodeDef; depth: number;
  selectedId: string; expandedIds: Set<string>;
  onSelect: (id: string, label: string) => void;
  onToggle: (id: string) => void;
}) {
  const isSelected = selectedId === node.id;
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        onClick={() => {
          onSelect(node.id, node.label);
          if (hasChildren) onToggle(node.id);
        }}
        style={{ paddingLeft: `${10 + depth * 16}px`, paddingRight: '8px' }}
        className={`flex items-center gap-1.5 h-8 rounded-md cursor-pointer text-xs transition-colors select-none
          ${isSelected
            ? 'bg-[#3B82F6] text-white font-semibold'
            : 'text-slate-600 hover:bg-blue-50 hover:text-slate-900'}`}
      >
        <span className="w-4 flex-shrink-0 flex items-center justify-center">
          {hasChildren
            ? isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              : <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            : null}
        </span>
        {nodeIcon(node.type, isSelected)}
        <span className="flex-1 truncate leading-none">{node.label}</span>
        {isSelected && <Check className="w-3 h-3 flex-shrink-0 opacity-80" />}
      </div>
      {hasChildren && isExpanded && node.children!.map(c => (
        <TreeDropdownNode key={c.id} node={c} depth={depth + 1}
          selectedId={selectedId} expandedIds={expandedIds}
          onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

function TreeSelectDropdown({
  tree, value, label, onChange,
}: {
  tree: TreeNodeDef[];
  value: string;
  label: string;
  onChange: (id: string, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['org-1', 'proj-1', 'proj-2']));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const handleSelect = (id: string, lbl: string) => {
    onChange(id, lbl);
    setOpen(false);
    setSearch('');
  };

  const isSearching = search.trim().length > 0;
  const flatResults = isSearching ? flattenTree(tree, search.trim()) : [];

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className={`h-9 flex items-center gap-2 px-3 border rounded-md text-sm transition-all bg-white min-w-[175px]
          ${open
            ? 'border-blue-400 ring-2 ring-blue-100 text-slate-700'
            : 'border-slate-300 text-slate-500 hover:border-blue-300 hover:bg-blue-50/20'}`}
      >
        <Network className={`w-3.5 h-3.5 flex-shrink-0 ${value ? 'text-blue-500' : 'text-slate-400'}`} />
        <span className={`flex-1 text-left truncate ${value ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
          {label || '选择项目节点'}
        </span>
        {value ? (
          <button
            onClick={e => { e.stopPropagation(); onChange('', ''); }}
            className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50
          overflow-hidden"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {/* Search bar */}
          <div className="px-2.5 py-2 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="搜索节点..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-8 text-xs border border-slate-200 rounded-md bg-slate-50
                  focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Tree content */}
          <div className="overflow-auto py-1.5 px-1.5" style={{ maxHeight: '260px' }}>
            {isSearching ? (
              flatResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Search className="w-5 h-5 mb-1.5 opacity-40" />
                  <span className="text-xs">未找到匹配节点</span>
                </div>
              ) : (
                flatResults.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleSelect(n.id, n.label)}
                    className={`flex items-center gap-2 h-8 px-3 rounded-md cursor-pointer text-xs transition-colors select-none
                      ${value === n.id
                        ? 'bg-[#3B82F6] text-white font-semibold'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-slate-900'}`}
                  >
                    {nodeIcon(n.type, value === n.id)}
                    <span className="flex-1 truncate">{n.label}</span>
                    {value === n.id && <Check className="w-3 h-3 flex-shrink-0 opacity-80" />}
                  </div>
                ))
              )
            ) : (
              tree.map(n => (
                <TreeDropdownNode key={n.id} node={n} depth={0}
                  selectedId={value} expandedIds={expanded}
                  onSelect={handleSelect} onToggle={toggle} />
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-slate-100 px-3 py-1.5 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">点击节点进行筛选</span>
            {value && (
              <button
                onClick={() => { onChange('', ''); setOpen(false); }}
                className="text-[11px] text-blue-500 hover:text-blue-700 font-medium"
              >
                清除选择
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── search input ─────────────────── */
function SearchInput({
  placeholder, value, onChange, width = 'w-36',
}: { placeholder: string; value: string; onChange: (v: string) => void; width?: string }) {
  return (
    <div className={`relative ${width}`}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 w-full pl-8 pr-8 border border-slate-300 rounded-md text-sm placeholder:text-slate-400
          focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────── top bar ─────────────────── */
function TopBar({
  viewMode, onViewChange,
  name, setName, sn, setSn, imei, setImei,
}: {
  viewMode: ViewMode; onViewChange: (v: ViewMode) => void;
  name: string; setName: (v: string) => void;
  sn: string;   setSn:   (v: string) => void;
  imei: string; setImei: (v: string) => void;
}) {
  const [nodeId, setNodeId] = useState('');
  const [nodeLabel, setNodeLabel] = useState('');

  return (
    <div
      className="bg-white border-b border-slate-200 flex items-center gap-2.5 px-5 py-2.5 flex-shrink-0"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <TreeSelectDropdown
        tree={TREE}
        value={nodeId}
        label={nodeLabel}
        onChange={(id, lbl) => { setNodeId(id); setNodeLabel(lbl); }}
      />

      <SearchInput placeholder="监测点位名称" value={name} onChange={setName} width="w-40" />
      <SearchInput placeholder="输入 S/N"      value={sn}   onChange={setSn}   width="w-36" />
      <SearchInput placeholder="输入 TNS/IMEI" value={imei} onChange={setImei} width="w-40" />

      <div className="flex-1" />

      <button className="h-9 px-5 bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold
        rounded-md transition-colors shadow-sm shadow-blue-200">
        查询
      </button>
      <button className="h-9 px-4 border border-slate-300 text-slate-500 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
        重置
      </button>

      <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
        {(['grid', 'list'] as ViewMode[]).map(m => (
          <button
            key={m}
            onClick={() => onViewChange(m)}
            title={m === 'grid' ? '卡片视图' : '列表视图'}
            className={`flex items-center justify-center w-8 h-7 rounded transition-all
              ${viewMode === m ? 'bg-[#3B82F6] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-white'}`}
          >
            {m === 'grid' ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── device card ─────────────────── */
/* Show 3 chips → leaves room for the +N badge to sit on row 2 */
const MAX_CHIPS = 3;

function DeviceCard({ device, onDetail }: { device: Device; onDetail: () => void }) {
  const online = device.status === 'online';
  const offline = device.status === 'offline';
  const visibleMetrics = device.metrics.slice(0, MAX_CHIPS);
  const overflow = device.metrics.length - MAX_CHIPS;

  return (
    <div className={`bg-white rounded-lg flex flex-col overflow-hidden
      ${device.hasAlert ? 'border border-red-200 shadow-sm' : 'border border-slate-200 shadow-sm'}`}
    >
      {/* ── 1. 头部：图标 + 标题 + 右侧小图标 ── */}
      <div className="px-4 pt-4 pb-0 flex items-center gap-2.5">
        {/* 左：设备 icon */}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
          ${offline ? 'bg-slate-100' : 'bg-[#3B82F6]'}`}>
          {/* 设备形象：用叠加方块模拟 IoT 设备 */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="5" width="16" height="10" rx="2"
              fill={offline ? '#9CA3AF' : 'white'} fillOpacity="0.9" />
            <rect x="5" y="8" width="3" height="4" rx="0.5"
              fill={offline ? '#D1D5DB' : '#93C5FD'} />
            <rect x="9" y="8" width="3" height="4" rx="0.5"
              fill={offline ? '#D1D5DB' : '#93C5FD'} />
            <rect x="13" y="8" width="2" height="4" rx="0.5"
              fill={offline ? '#D1D5DB' : '#BFDBFE'} />
            <rect x="8" y="2" width="4" height="3" rx="1"
              fill={offline ? '#9CA3AF' : 'white'} fillOpacity="0.6" />
          </svg>
        </div>

        {/* 标题 */}
        <h4 className={`flex-1 min-w-0 flex items-center gap-1.5 font-bold truncate
          ${offline ? 'text-slate-400' : 'text-slate-900'}`}
          style={{ fontSize: '17px', lineHeight: '1.3' }}>
          <Star className={`w-4 h-4 flex-shrink-0
            ${offline ? 'text-slate-300 fill-slate-300' : 'text-yellow-500 fill-yellow-500'}`} />
          <span className="truncate">{device.locationName}</span>
        </h4>

        {/* 右侧：二维码 + 信号图标 */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-1">
          <button className="text-slate-300 hover:text-slate-500 transition-colors" title="二维码">
            {/* 二维码 icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <rect x="3" y="3" width="2" height="2" fill="currentColor" />
              <rect x="9" y="1" width="6" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <rect x="11" y="3" width="2" height="2" fill="currentColor" />
              <rect x="1" y="9" width="6" height="6" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <rect x="3" y="11" width="2" height="2" fill="currentColor" />
              <rect x="9" y="9" width="2" height="2" fill="currentColor" />
              <rect x="13" y="9" width="2" height="2" fill="currentColor" />
              <rect x="9" y="13" width="2" height="2" fill="currentColor" />
              <rect x="13" y="13" width="2" height="2" fill="currentColor" />
            </svg>
          </button>
          {/* 手机信号阶梯 icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="11" width="3" height="4" rx="0.5"
              fill={online ? '#3B82F6' : '#D1D5DB'} />
            <rect x="5.5" y="7.5" width="3" height="7.5" rx="0.5"
              fill={online ? '#3B82F6' : '#D1D5DB'} />
            <rect x="10" y="4" width="3" height="11" rx="0.5"
              fill={online ? '#3B82F6' : '#D1D5DB'} />
            {/* 4th bar greyed even when online — represents max signal */}
            <rect x="14.5" y="1" width="0" height="0" rx="0.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* ── 2. 工况状态（预留两行，标签风格） ── */}
      <div className="px-4 pt-2.5 pb-0" style={{ minHeight: '56px' }}>
        {online ? (
          <>
            {/* 第一排标签 */}
            <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] font-medium bg-green-50 text-green-700 border border-green-100">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />在线
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                电压 {device.volt}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-orange-50 text-orange-600 border border-orange-100">
                温度 {device.temp}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-sky-50 text-sky-600 border border-sky-100">
                湿度 {device.humi}
              </span>
            </div>
            {/* 第二排：告警提示 or 空占位 */}
            <div className="h-[22px] flex items-center">
              {device.hasAlert && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] font-semibold bg-red-50 text-red-600 border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />存在告警，请及时处理
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />离线
              </span>
            </div>
            <div className="h-[22px]" />
          </>
        )}
      </div>

      {/* ── 3. 序列号（弱化） ── */}
      <div className="px-4 pt-1.5 pb-0">
        <p className="text-[11px] text-slate-300 leading-none truncate">
          S/N: {device.sn}&nbsp;&nbsp;|&nbsp;&nbsp;IMEI: {device.imei}
        </p>
      </div>

      {/* ── 4. 数据区（词云方块，固定两行高，末尾溢出badge） ── */}
      <div className="px-4 pt-2.5 pb-3 flex-1">
        {online ? (
          /* 固定高度 = 两行chips：每chip约28px + gap 6px = 62px */
          <div className="flex flex-wrap gap-1.5 items-start content-start overflow-hidden"
            style={{ minHeight: '62px', maxHeight: '62px' }}>
            {visibleMetrics.map(m =>
              m.alert ? (
                <span key={m.k}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-bold
                    bg-red-50 text-red-600 border border-red-100 whitespace-nowrap leading-none">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {m.k}: {m.v}{m.unit}
                </span>
              ) : (
                <span key={m.k}
                  className="inline-flex items-center px-2 py-1 rounded-md text-[13px] font-medium
                    bg-blue-50 text-[#2563EB] border border-blue-100 whitespace-nowrap leading-none">
                  <span className="text-slate-500 mr-0.5">{m.k}:</span>
                  <span className="font-semibold ml-0.5">{m.v}{m.unit}</span>
                </span>
              )
            )}
            {/* 溢出徽章：始终显示（数据项>MAX_CHIPS时） */}
            {overflow > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 rounded-md text-[12px] font-semibold
                bg-slate-100 text-slate-400 border border-slate-200 whitespace-nowrap leading-none flex-shrink-0">
                +{overflow} 项
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ minHeight: '62px' }}>
            <span className="text-sm text-slate-300">设备已离线，暂无数据</span>
          </div>
        )}
      </div>

      {/* ── 5. 底部操作栏 ── */}
      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
        <span className={`text-[11px] ${offline ? 'text-slate-300' : 'text-slate-400'}`}>
          更新时间：{device.updated}
        </span>
        <button
          onClick={onDetail}
          className={`flex items-center gap-1 text-[13px] font-medium transition-colors
            ${offline ? 'text-slate-300 cursor-default' : 'text-[#3B82F6] hover:text-blue-700'}`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          查看数据详情
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── pagination ─────────────────── */
function PBtn({
  children, onClick, disabled, active,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; active?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded border text-sm transition-colors
        ${active   ? 'bg-[#3B82F6] text-white border-[#3B82F6] font-medium'
        : disabled ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                   : 'border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-500'}`}>
      {children}
    </button>
  );
}

function PaginationBar({ total, current, totalPages, onChange }: {
  total: number; current: number; totalPages: number; onChange: (p: number) => void;
}) {
  return (
    <div className="flex-shrink-0 bg-white border-t border-slate-200 px-5 h-12 flex items-center justify-between">
      <span className="text-sm text-slate-500">共 <span className="font-medium text-slate-700">{total}</span> 条记录</span>
      <div className="flex items-center gap-1">
        <PBtn disabled={current === 1} onClick={() => onChange(current - 1)}>‹</PBtn>
        {[1,2,3].map(p => <PBtn key={p} active={current === p} onClick={() => onChange(p)}>{p}</PBtn>)}
        <span className="px-1 text-slate-400 text-sm">…</span>
        <PBtn active={current === totalPages} onClick={() => onChange(totalPages)}>{totalPages}</PBtn>
        <PBtn disabled={current === totalPages} onClick={() => onChange(current + 1)}>›</PBtn>
      </div>
      <select className="h-8 px-2 border border-slate-200 rounded text-sm text-slate-500
        focus:outline-none focus:border-blue-400 bg-white">
        <option>9 条/页</option>
        <option>18 条/页</option>
        <option>36 条/页</option>
      </select>
    </div>
  );
}

/* ─────────────────── grid view ─────────────────── */
function GridView({ onDetail }: { onDetail: () => void }) {
  const [page, setPage] = useState(1);
  const TOTAL = 92;
  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(TOTAL / PAGE_SIZE);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto px-5 pt-4 pb-2">
        <div className="grid grid-cols-3 gap-3">
          {DEVICES.map(d => (
            <DeviceCard key={d.id} device={d} onDetail={onDetail} />
          ))}
        </div>
      </div>
      <PaginationBar total={TOTAL} current={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

/* ─────────────────── resource tree ─────────────────── */
function TreeNodeItem({
  node, depth, selected, expanded, onSelect, onToggle,
}: {
  node: TreeNodeDef; depth: number;
  selected: string; expanded: Set<string>;
  onSelect: (id: string) => void; onToggle: (id: string) => void;
}) {
  const isSel = selected === node.id;
  const isExp = expanded.has(node.id);
  const hasKids = !!node.children?.length;

  return (
    <div>
      <div
        onClick={() => { onSelect(node.id); if (hasKids) onToggle(node.id); }}
        style={{ paddingLeft: `${8 + depth * 14}px`, paddingRight: '8px' }}
        className={`flex items-center gap-1.5 h-8 rounded-md cursor-pointer text-xs transition-colors select-none
          ${isSel ? 'bg-[#3B82F6] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
      >
        <span className="w-3.5 flex-shrink-0 flex items-center justify-center">
          {hasKids && (isExp
            ? <ChevronDown className="w-3 h-3" />
            : <ChevronRight className="w-3 h-3" />)}
        </span>
        {node.type !== 'device'
          ? <FolderOpen className={`w-3.5 h-3.5 flex-shrink-0 ${isSel ? 'text-white' : 'text-amber-500'}`} />
          : <MapPin     className={`w-3.5 h-3.5 flex-shrink-0 ${isSel ? 'text-white' : 'text-slate-400'}`} />}
        <span className="flex-1 truncate leading-none">{node.label}</span>
      </div>
      {hasKids && isExp && node.children!.map(c => (
        <TreeNodeItem key={c.id} node={c} depth={depth + 1}
          selected={selected} expanded={expanded}
          onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

/* ─────────────────── aggregation band ─────────────────── */
function AggBand() {
  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-2 flex items-center gap-4 flex-wrap">
      <span className="text-sm font-bold text-slate-800">项目：成都市水文监测项目</span>
      <div className="w-px h-4 bg-slate-200" />
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs text-slate-500">设备总数:&nbsp;
          <span className="font-mono font-bold text-slate-800">120</span>
        </span>
        <span className="text-xs text-slate-500">在线:&nbsp;
          <span className="font-mono font-bold text-emerald-600">110</span>
        </span>
        <span className="text-xs text-slate-500">离线:&nbsp;
          <span className="font-mono font-bold text-slate-400">5</span>
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold"
          style={{ boxShadow: '0 0 0 3px rgba(239,68,68,0.18), 0 0 8px rgba(239,68,68,0.28)' }}
        >
          <AlertTriangle className="w-3 h-3" />告警&nbsp;5
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">在线率</span>
          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91.6%' }} />
          </div>
          <span className="text-xs font-bold text-emerald-600 font-mono">91.6%</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── data table ─────────────────── */
const COLS = ['监测点位名称', 'S/N', 'TNS/IMEI', '数据类型', '数据值', '更新时间', '告警状态', '操作'];

function DataTable() {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full min-w-[960px] border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-white h-12 sticky top-0 z-10">
            {COLS.map(c => (
              <th key={c} className="px-6 text-left text-sm font-semibold text-slate-700 whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map((row, i) => (
            <tr
              key={`${row.deviceId}-${i}`}
              className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors"
              style={{ height: '52px' }}
            >
              <td className="px-6 text-sm text-slate-900 font-medium">
                {row.isFirst ? row.locationName : ''}
              </td>
              <td className="px-6 text-sm text-slate-900">
                {row.isFirst ? row.sn : ''}
              </td>
              <td className="px-6 text-sm text-slate-900">
                {row.isFirst ? row.imei : ''}
              </td>
              <td className="px-6 text-sm text-slate-700">{row.dataType}</td>
              <td className="px-6">
                {row.offline
                  ? <span className="text-sm text-slate-400">—</span>
                  : <span className={`text-sm font-medium ${row.alert ? 'text-red-600' : 'text-slate-900'}`}>{row.dataValue}</span>}
              </td>
              <td className="px-6 text-sm text-slate-500">{row.updated}</td>
              <td className="px-6">
                {row.alert
                  ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-50 text-red-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />告警
                    </span>
                  : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />正常
                    </span>}
              </td>
              <td className="px-6">
                {row.isFirst && (
                  <button className="text-sm text-[#3B82F6] hover:text-blue-700 font-medium transition-colors">
                    查看数据
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────── list view ─────────────────── */
function ListView() {
  const [selected, setSelected] = useState('proj-1');
  const [expanded, setExpanded] = useState(new Set(['org-1', 'proj-1']));
  const [page, setPage] = useState(1);
  const TOTAL = 92;
  const PAGE_SIZE = 9;

  const toggle = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  return (
    <div className="flex-1 min-h-0 flex mx-5 my-4 rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      {/* left tree */}
      <div className="w-52 flex-shrink-0 flex flex-col border-r border-slate-200 bg-slate-50/60">
        <div className="px-3.5 py-2.5 border-b border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">资源导航</span>
        </div>
        <div className="flex-1 overflow-auto py-1.5 px-1.5">
          {TREE.map(n => (
            <TreeNodeItem key={n.id} node={n} depth={0}
              selected={selected} expanded={expanded}
              onSelect={setSelected} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* right */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <AggBand />
        <DataTable />
        <PaginationBar
          total={TOTAL} current={page}
          totalPages={Math.ceil(TOTAL / PAGE_SIZE)}
          onChange={setPage}
        />
      </div>
    </div>
  );
}

/* ─────────────────── root export ─────────────────── */
export function DataAnalysisPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [name,  setName]  = useState('');
  const [sn,    setSn]    = useState('');
  const [imei,  setImei]  = useState('');

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F3F4F6] overflow-hidden">
      <TopBar
        viewMode={viewMode} onViewChange={setViewMode}
        name={name}   setName={setName}
        sn={sn}       setSn={setSn}
        imei={imei}   setImei={setImei}
      />
      {viewMode === 'grid' && <GridView onDetail={() => setViewMode('list')} />}
      {viewMode === 'list' && <ListView />}
    </div>
  );
}
