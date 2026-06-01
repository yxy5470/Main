import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

/* ─────────────────── role list data ─────────────────── */
interface Role {
  id: string;
  name: string;
  tag: string;
  tagColor: 'blue' | 'purple' | 'green' | 'gray';
  group: string;
  desc: string;
}

const ROLES: Role[] = [
  { id: 'super',    name: '超级管理员',    tag: '全局',  tagColor: 'blue',   group: '平台级角色',   desc: '拥有平台所有功能的最高权限，可管理所有集成商、项目及用户。' },
  { id: 'integra',  name: '集成商管理员',  tag: '集成商', tagColor: 'purple', group: '集成商级角色', desc: '可管理本集成商下所有项目及项目人员，无法跨集成商操作。' },
  { id: 'senior',   name: '项目高级运维员', tag: '项目',  tagColor: 'green',  group: '项目级角色',   desc: '拥有项目内的设备管理、告警处理等完整运维权限，不含系统配置权限。' },
  { id: 'readonly', name: '项目只读访客',  tag: '项目',  tagColor: 'gray',   group: '项目级角色',   desc: '此角色适用于项目视察领导或外部访客。仅允许查看设备和监测数据，无任何控制、修改设备和处理告警的权限。' },
];

const TAG_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  blue:   { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  purple: { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  green:  { text: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  gray:   { text: '#595959', bg: '#F5F5F5', border: '#D9D9D9' },
};

/* ─────────────────── permission tree data ─────────────────── */
interface PermNode {
  id: string;
  label: string;
  emoji?: string;
  children?: PermNode[];
}

const PERM_TREE: PermNode[] = [
  { id: 'analysis', label: '监测数据与分析' },
  {
    id: 'alarm', label: '告警中心',
    children: [
      { id: 'alarm-view',    label: '查看告警列表',  emoji: '👀' },
      { id: 'alarm-handle',  label: '处理告警',      emoji: '✅' },
      { id: 'alarm-setting', label: '设置告警规则',  emoji: '⚙️' },
    ],
  },
  {
    id: 'device', label: '设备管理',
    children: [
      { id: 'device-view',   label: '查看设备',     emoji: '👀' },
      { id: 'device-edit',   label: '新增/编辑设备', emoji: '➕' },
      { id: 'device-config', label: '配置设备',     emoji: '🕹️' },
    ],
  },
  {
    id: 'project', label: '项目管理',
    children: [
      { id: 'project-view', label: '查看项目',     emoji: '👀' },
      { id: 'project-edit', label: '新增/编辑项目', emoji: '➕' },
    ],
  },
  {
    id: 'system', label: '系统管理',
    children: [
      { id: 'sys-user',   label: '用户管理' },
      { id: 'sys-role',   label: '角色管理' },
      { id: 'sys-devt',   label: '设备类型' },
      { id: 'sys-datat',  label: '数据类型' },
      { id: 'sys-notice', label: '通知公告' },
      { id: 'sys-login',  label: '登录日志' },
      { id: 'sys-op',     label: '操作日志' },
    ],
  },
];

/* default checked ids for "readonly" role */
const READONLY_CHECKED = new Set([
  'analysis',
  'alarm', 'alarm-view',
  'device', 'device-view',
  'project', 'project-view',
  'system', 'sys-user',
]);

/* ─────────────────── helpers ─────────────────── */
function getAllIds(nodes: PermNode[]): string[] {
  return nodes.flatMap(n => [n.id, ...(n.children ? getAllIds(n.children) : [])]);
}

function getChildIds(node: PermNode): string[] {
  return node.children ? getAllIds(node.children) : [];
}

/** 'checked' | 'indeterminate' | 'unchecked' */
function nodeState(node: PermNode, checked: Set<string>): 'checked' | 'indeterminate' | 'unchecked' {
  if (!node.children) return checked.has(node.id) ? 'checked' : 'unchecked';
  const childIds = getChildIds(node);
  const checkedCount = childIds.filter(id => checked.has(id)).length;
  if (checkedCount === 0) return 'unchecked';
  if (checkedCount === childIds.length && checked.has(node.id)) return 'checked';
  return 'indeterminate';
}

/* ─────────────────── checkbox component ─────────────────── */
function PermCheckbox({
  state, onChange,
}: { state: 'checked' | 'indeterminate' | 'unchecked'; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
      style={{
        borderColor: state === 'unchecked' ? '#D9D9D9' : '#1890FF',
        background:  state === 'unchecked' ? '#fff' : '#1890FF',
      }}
    >
      {state === 'checked' && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === 'indeterminate' && (
        <div className="w-2 h-0.5 bg-white rounded-full" />
      )}
    </button>
  );
}

/* ─────────────────── perm tree node ─────────────────── */
function PermTreeNode({
  node, depth, checked, onToggle,
}: {
  node: PermNode; depth: number;
  checked: Set<string>;
  onToggle: (node: PermNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const state = nodeState(node, checked);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 rounded-md hover:bg-slate-50 transition-colors px-2"
        style={{ paddingLeft: `${8 + depth * 20}px` }}
      >
        <PermCheckbox state={state} onChange={() => onToggle(node)} />

        {hasChildren && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-600 flex-shrink-0"
          />
        )}
        {!hasChildren && <span className="w-4 flex-shrink-0" />}

        <span className={`text-sm select-none ${depth === 0 ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
          {node.label}
        </span>
      </div>

      {hasChildren && expanded && node.children!.map(child => (
        <PermTreeNode key={child.id} node={child} depth={depth + 1}
          checked={checked} onToggle={onToggle} />
      ))}
    </div>
  );
}

/* ─────────────────── group separator ─────────────────── */
function GroupLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-3 pb-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[3]); // "项目只读访客"
  const [activeTab, setActiveTab]       = useState<'menu' | 'data'>('menu');
  const [checked, setChecked]           = useState<Set<string>>(new Set(READONLY_CHECKED));
  const [searchRole, setSearchRole]     = useState('');

  /* toggle a node and cascade up/down */
  const toggleNode = (node: PermNode) => {
    const next = new Set(checked);
    const state = nodeState(node, next);

    if (state === 'checked') {
      // uncheck self + all descendants
      [node.id, ...getChildIds(node)].forEach(id => next.delete(id));
    } else {
      // check self + all descendants
      [node.id, ...getChildIds(node)].forEach(id => next.add(id));
    }

    // re-derive parent states (one level up is enough for 2-level tree)
    PERM_TREE.forEach(parent => {
      if (!parent.children) return;
      const childIds = getChildIds(parent);
      const anyChecked = childIds.some(id => next.has(id));
      if (anyChecked) next.add(parent.id); else next.delete(parent.id);
    });

    setChecked(next);
  };

  /* switch role → reset permissions to a reasonable default */
  const selectRole = (role: Role) => {
    setSelectedRole(role);
    if (role.id === 'readonly') {
      setChecked(new Set(READONLY_CHECKED));
    } else if (role.id === 'super') {
      setChecked(new Set(getAllIds(PERM_TREE)));
    } else if (role.id === 'senior') {
      setChecked(new Set([
        'analysis',
        'alarm', 'alarm-view', 'alarm-handle',
        'device', 'device-view', 'device-edit',
        'project', 'project-view',
        'system', 'sys-user',
      ]));
    } else {
      setChecked(new Set(getAllIds(PERM_TREE)));
    }
  };

  const groups = [...new Set(ROLES.map(r => r.group))];

  return (
    <div className="flex-1 min-h-0 flex bg-[#F3F4F6] overflow-hidden p-5 gap-4">

      {/* ── 左侧角色列表 (30%) ── */}
      <div className="w-[30%] flex-shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* 搜索 + 新增 */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 h-8 px-3 border border-slate-300 rounded-md
            focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-white">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="搜索角色名称"
              value={searchRole}
              onChange={e => setSearchRole(e.target.value)}
              className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-300"
            />
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1890FF] hover:bg-blue-600
            text-white transition-colors flex-shrink-0" title="新增角色">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* 角色列表 */}
        <div className="flex-1 overflow-auto">
          {groups.map(group => (
            <div key={group}>
              <GroupLabel label={group} />
              {ROLES.filter(r => r.group === group && r.name.includes(searchRole)).map(role => {
                const tc = TAG_STYLE[role.tagColor];
                const isActive = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => selectRole(role)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 mx-1 transition-colors rounded-md relative"
                    style={{
                      width: 'calc(100% - 8px)',
                      background: isActive ? '#E6F7FF' : 'transparent',
                      borderLeft: isActive ? '3px solid #1890FF' : '3px solid transparent',
                    }}
                  >
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${isActive ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
                        {role.name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0"
                        style={{ color: tc.text, background: tc.bg, borderColor: tc.border }}>
                        {role.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── 右侧权限配置 (70%) ── */}
      <div className="flex-1 min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">

        {/* 角色基本信息 header */}
        <div className="px-6 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-1.5">
            <h2 className="text-xl font-bold text-slate-900">{selectedRole.name}</h2>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <button className="h-8 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm rounded-md transition-colors">
                编辑基本信息
              </button>
              <button className="h-8 px-4 text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                删除角色
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed max-w-2xl">{selectedRole.desc}</p>
          <div className="border-t border-slate-100" />
        </div>

        {/* Tab 页签 */}
        <div className="px-6 flex-shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-6">
            {(['menu', 'data'] as const).map(tab => {
              const label = tab === 'menu' ? '菜单与功能权限' : '数据范围权限';
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 text-sm font-medium transition-colors relative ${active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 权限树 / 数据范围 */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {activeTab === 'menu' ? (
            <div>
              {PERM_TREE.map(node => (
                <PermTreeNode key={node.id} node={node} depth={0}
                  checked={checked} onToggle={toggleNode} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-slate-300">
              数据范围权限配置（敬请期待）
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button className="h-9 px-5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
            取消
          </button>
          <button className="h-9 px-5 bg-[#1890FF] hover:bg-blue-600 text-white text-sm font-medium rounded-md
            transition-colors shadow-sm">
            保存当前权限配置
          </button>
        </div>
      </div>
    </div>
  );
}
