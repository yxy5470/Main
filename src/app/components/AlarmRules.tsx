import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronRight, FolderOpen, MapPin,
  Grid3x3, List, ChevronLeft, ChevronRight as ChevronR,
} from 'lucide-react';
import { TreeSelect } from './TreeSelect';

/* ─────────────────── types ─────────────────── */
interface AlarmRule {
  deviceName: string;
  sn: string;
  imei: string;
  dataType: string;
  dataCode: string;
  blueMin: string;
  blueMax: string;
  yellowMin: string;
  yellowMax: string;
  orangeMin: string;
  orangeMax: string;
  redMin: string;
  redMax: string;
  enabled: boolean;
}

interface DeviceGroup {
  deviceName: string;
  sn: string;
  imei: string;
  rules: AlarmRule[];
}

/* ─────────────────── mock data ─────────────────── */
const DEVICE_GROUPS: DeviceGroup[] = [
  {
    deviceName: '主干渠1号',
    sn: 'CR120251120001',
    imei: '868381079719402',
    rules: [
      {
        deviceName: '主干渠1号', sn: 'CR120251120001', imei: '868381079719402',
        dataType: '水位', dataCode: 'WL01',
        blueMin: '-', blueMax: '2.5', yellowMin: '-', yellowMax: '3.5',
        orangeMin: '-', orangeMax: '4.0', redMin: '-', redMax: '4.5',
        enabled: true,
      },
      {
        deviceName: '主干渠1号', sn: 'CR120251120001', imei: '868381079719402',
        dataType: '水压', dataCode: 'WP01',
        blueMin: '0.5', blueMax: '1.5', yellowMin: '0.3', yellowMax: '1.8',
        orangeMin: '0.2', orangeMax: '2.0', redMin: '-', redMax: '2.5',
        enabled: true,
      },
      {
        deviceName: '主干渠1号', sn: 'CR120251120001', imei: '868381079719402',
        dataType: '流量', dataCode: 'FL01',
        blueMin: '-', blueMax: '-', yellowMin: '-', yellowMax: '-',
        orangeMin: '100', orangeMax: '150', redMin: '-', redMax: '200',
        enabled: false,
      },
    ],
  },
  {
    deviceName: '闸口流量站',
    sn: 'CR120251120010',
    imei: '868381079719415',
    rules: [
      {
        deviceName: '闸口流量站', sn: 'CR120251120010', imei: '868381079719415',
        dataType: '浊度', dataCode: 'TB01',
        blueMin: '-', blueMax: '20', yellowMin: '-', yellowMax: '35',
        orangeMin: '-', orangeMax: '50', redMin: '-', redMax: '60',
        enabled: true,
      },
    ],
  },
];

/* ─────────────────── tree node ─────────────────── */
interface TreeNode {
  id: string;
  label: string;
  type: 'org' | 'project' | 'device';
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    id: 'ceyike', label: '测艺科技', type: 'org',
    children: [
      {
        id: 'chengdu', label: '成都子项目', type: 'project',
        children: [
          { id: 'device-1', label: '主干渠1号', type: 'device' },
          { id: 'device-2', label: '闸口流量站', type: 'device' },
          { id: 'device-3', label: '支渠A01', type: 'device' },
          { id: 'device-4', label: '主干渠2号', type: 'device' },
          { id: 'device-5', label: '泵站监测点', type: 'device' },
        ],
      },
    ],
  },
];

/* ─────────────────── small components ─────────────────── */
function TreeItem({
  node, depth, selected, expanded, onSelect, onToggle,
}: {
  node: TreeNode; depth: number; selected: string;
  expanded: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const isSel = selected === node.id;
  const isExp = expanded.has(node.id);
  const hasChildren = !!node.children?.length;

  const Icon =
    node.type === 'org'     ? <FolderOpen className="w-4 h-4 flex-shrink-0 text-amber-500" /> :
    node.type === 'project' ? <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" /> :
                              <MapPin className="w-4 h-4 flex-shrink-0 text-slate-400" />;

  return (
    <div>
      <div
        onClick={() => { onSelect(node.id); if (hasChildren) onToggle(node.id); }}
        style={{ paddingLeft: `${10 + depth * 16}px` }}
        className={`flex items-center gap-1.5 h-9 pr-3 rounded-md cursor-pointer text-sm select-none transition-colors
          ${isSel ? 'bg-[#1890FF] text-white font-medium' : 'text-[#262626] hover:bg-slate-100'}`}
      >
        {hasChildren && (
          <span className="w-4 flex items-center justify-center flex-shrink-0">
            {isExp ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        )}
        {!hasChildren && <span className="w-4 flex-shrink-0" />}
        {Icon}
        <span className="flex-1 truncate">{node.label}</span>
      </div>
      {hasChildren && isExp && node.children!.map(child => (
        <TreeItem key={child.id} node={child} depth={depth + 1}
          selected={selected} expanded={expanded}
          onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

function Switch({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
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

function Pagination({ current, total, onChange }: {
  current: number; total: number; onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronLeft className="w-4 h-4" />
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
      {total > 5 && <span className="px-1 text-[#8C8C8C] text-sm">…</span>}
      {total > 5 && (
        <button onClick={() => onChange(total)}
          className="w-8 h-8 flex items-center justify-center border rounded text-sm hover:border-[#40A9FF] hover:text-[#1890FF] transition-colors"
          style={{
            borderColor: current === total ? '#1890FF' : '#D9D9D9',
            background: current === total ? '#1890FF' : 'white',
            color: current === total ? 'white' : '#595959',
          }}>{total}</button>
      )}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="w-8 h-8 flex items-center justify-center border border-[#D9D9D9] rounded text-sm
          hover:border-[#40A9FF] hover:text-[#1890FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <ChevronR className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function AlarmRules() {
  const [projectFilter, setProjectFilter] = useState('1-1');
  const [locationName, setLocationName] = useState('');
  const [snSearch, setSnSearch] = useState('');
  const [imeiSearch, setImeiSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedNode, setSelectedNode] = useState('chengdu');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['ceyike', 'chengdu']));
  const [currentPage, setCurrentPage] = useState(1);

  const projectTreeData = [
    { id: '1', label: '四川省水利项目', children: [{ id: '1-1', label: '德阳文庙监测点' }] },
    { id: '2', label: '广东省气象项目', children: [{ id: '2-1', label: '广州观测站' }] },
  ];

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  const TOTAL_RECORDS = 92;
  const TOTAL_PAGES = 11;
  const PAGE_SIZE = 9;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F0F2F5] overflow-hidden">
      {/* ── 顶部搜索栏 ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E8E8E8] px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <TreeSelect
            data={projectTreeData}
            value={projectFilter}
            onChange={setProjectFilter}
            placeholder="选择项目节点"
          />
          <input
            type="text"
            placeholder="监测点位名称"
            value={locationName}
            onChange={e => setLocationName(e.target.value)}
            className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
              placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
              focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
            style={{ minWidth: 160 }}
          />
          <input
            type="text"
            placeholder="输入 S/N"
            value={snSearch}
            onChange={e => setSnSearch(e.target.value)}
            className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
              placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
              focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
            style={{ minWidth: 140 }}
          />
          <input
            type="text"
            placeholder="输入 IMEI"
            value={imeiSearch}
            onChange={e => setImeiSearch(e.target.value)}
            className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#262626]
              placeholder:text-[#BFBFBF] focus:outline-none focus:border-[#40A9FF]
              focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] transition-all"
            style={{ minWidth: 160 }}
          />

          <button className="h-8 px-5 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded transition-colors">
            查询
          </button>
          <button className="h-8 px-5 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
            hover:text-[#1890FF] text-sm rounded bg-white transition-colors">
            重置
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 flex items-center justify-center border rounded transition-colors
                ${viewMode === 'grid' ? 'border-[#1890FF] bg-[#E6F7FF] text-[#1890FF]' : 'border-[#D9D9D9] text-[#8C8C8C] hover:border-[#40A9FF]'}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 flex items-center justify-center border rounded transition-colors
                ${viewMode === 'list' ? 'border-[#1890FF] bg-[#E6F7FF] text-[#1890FF]' : 'border-[#D9D9D9] text-[#8C8C8C] hover:border-[#40A9FF]'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 主体内容区 ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* 左侧导航树 (20%) */}
        <div className="w-[20%] flex-shrink-0 bg-white border-r border-[#E8E8E8] flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#E8E8E8]">
            <h3 className="text-sm font-semibold text-[#262626]">资源导航</h3>
          </div>
          <div className="flex-1 overflow-auto px-2 py-2">
            {TREE_DATA.map(node => (
              <TreeItem key={node.id} node={node} depth={0}
                selected={selectedNode} expanded={expandedNodes}
                onSelect={setSelectedNode} onToggle={toggleNode} />
            ))}
          </div>
        </div>

        {/* 右侧主体数据区 (80%) */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* 顶部统计信息栏 */}
          <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-[#E8E8E8] flex items-center gap-6 text-sm">
            <span className="font-semibold text-[#262626]">项目：成都市水文监测项目</span>
            <span className="text-[#595959]">设备总数: <span className="font-medium">120</span></span>
            <span className="text-[#52C41A] font-medium">在线: 110</span>
            <span className="text-[#8C8C8C]">离线: 5</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
              style={{ color: '#CF1322', background: '#FFF1F0', border: '1px solid #FFA39E' }}>
              🚨 告警: 5
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#595959]">在线率</span>
              <div className="w-24 h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#52C41A] rounded-full" style={{ width: '91.6%' }} />
              </div>
              <span className="text-[#52C41A] font-medium">91.6%</span>
            </div>
          </div>

          {/* 数据表格 */}
          <div className="flex-1 overflow-auto bg-[#F0F2F5] p-6">
            <div className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E8E8E8' }}>
                    {['监测点位名称', 'S/N', 'IMEI', '数据类型', '蓝色预警值', '黄色预警值', '橙色预警值', '红色预警值', '状态', '操作'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-[#262626] whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEVICE_GROUPS.map((group, groupIdx) => (
                    <React.Fragment key={`group-${groupIdx}`}>
                      {group.rules.map((rule, ruleIdx) => {
                        const isFirstRow = ruleIdx === 0;
                        const rowSpan = group.rules.length;

                        return (
                          <tr key={`${groupIdx}-${ruleIdx}`} className="hover:bg-[#FAFAFA] transition-colors"
                            style={{ borderBottom: '1px solid #F0F0F0' }}>
                            {/* 监测点位名称 - 跨行显示 */}
                            {isFirstRow && (
                              <td className="px-4 py-3 align-middle border-r border-[#F0F0F0]" rowSpan={rowSpan}>
                                <span className="text-sm font-medium text-[#262626]">{group.deviceName}</span>
                              </td>
                            )}

                            {/* S/N - 跨行显示 */}
                            {isFirstRow && (
                              <td className="px-4 py-3 align-middle border-r border-[#F0F0F0]" rowSpan={rowSpan}>
                                <code className="text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    fontFamily: 'SFMono-Regular, Consolas, monospace',
                                    color: '#595959', background: '#F5F5F5', border: '1px solid #E8E8E8',
                                  }}>
                                  {group.sn}
                                </code>
                              </td>
                            )}

                            {/* IMEI - 跨行显示 */}
                            {isFirstRow && (
                              <td className="px-4 py-3 align-middle border-r border-[#F0F0F0]" rowSpan={rowSpan}>
                                <code className="text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    fontFamily: 'SFMono-Regular, Consolas, monospace',
                                    color: '#595959', background: '#F5F5F5', border: '1px solid #E8E8E8',
                                  }}>
                                  {group.imei}
                                </code>
                              </td>
                            )}

                            {/* 数据类型 */}
                            <td className="px-4 py-3">
                              <span className="text-sm text-[#262626]">{rule.dataType} <span className="text-[#8C8C8C]">({rule.dataCode})</span></span>
                            </td>

                            {/* 蓝色预警值 */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium" style={{ color: '#1890FF' }}>
                                {rule.blueMin} | {rule.blueMax}
                              </span>
                            </td>

                            {/* 黄色预警值 */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium" style={{ color: '#FAAD14' }}>
                                {rule.yellowMin} | {rule.yellowMax}
                              </span>
                            </td>

                            {/* 橙色预警值 */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium" style={{ color: '#FA8C16' }}>
                                {rule.orangeMin} | {rule.orangeMax}
                              </span>
                            </td>

                            {/* 红色预警值 */}
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium" style={{ color: '#F5222D' }}>
                                {rule.redMin} | {rule.redMax}
                              </span>
                            </td>

                            {/* 状态开关 */}
                            <td className="px-4 py-3">
                              <Switch enabled={rule.enabled} onChange={() => {}} />
                            </td>

                            {/* 操作 */}
                            <td className="px-4 py-3">
                              <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors">
                                编辑
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {/* 设备组之间的分割线 */}
                      {groupIdx < DEVICE_GROUPS.length - 1 && (
                        <tr>
                          <td colSpan={10} className="p-0">
                            <div className="h-px bg-[#D9D9D9]" />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* 底部分页 */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-[#F0F0F0]"
                style={{ background: '#FAFAFA' }}>
                <span className="text-sm text-[#8C8C8C]">共 {TOTAL_RECORDS} 条记录</span>
                <Pagination current={currentPage} total={TOTAL_PAGES} onChange={setCurrentPage} />
                <div className="flex items-center gap-2">
                  <select className="h-8 px-3 border border-[#D9D9D9] rounded text-sm bg-white text-[#595959]
                    focus:outline-none focus:border-[#40A9FF] transition-colors">
                    <option>{PAGE_SIZE} 条/页</option>
                    <option>20 条/页</option>
                    <option>50 条/页</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
