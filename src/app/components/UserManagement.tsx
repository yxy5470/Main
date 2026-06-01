import { useState } from 'react';
import {
  Search, Plus, ChevronDown, ChevronRight, Globe, Building2,
  MapPin, MoreHorizontal, ChevronLeft, ChevronRight as ChevronR,
} from 'lucide-react';

/* ─────────────────── tree data ─────────────────── */
interface TreeNode {
  id: string;
  label: string;
  type: 'root' | 'integrator' | 'project';
  children?: TreeNode[];
}

const TREE: TreeNode[] = [
  {
    id: 'root', label: '超级管理员', type: 'root',
    children: [
      {
        id: 'ceyike', label: '测艺科技', type: 'integrator',
        children: [
          { id: 'chengdu-water', label: '成都智慧水务项目', type: 'project' },
          { id: 'zitong', label: '梓桐沟项目', type: 'project' },
        ],
      },
      {
        id: 'yinghetong', label: '盈和通创', type: 'integrator',
        children: [
          { id: 'yht-project1', label: '成都智慧水务项目', type: 'project' },
        ],
      },
    ],
  },
];

/* ─────────────────── user data ─────────────────── */
interface User {
  id: number;
  loginAccount: string;
  password: string;
  name: string;
  org: string;
  role: string;
  phone: string;
  enabled: boolean;
}

const USERS: User[] = [
  { id: 1, loginAccount: 'hz_admin',    password: '123456', name: '杨健',  org: '成都智慧水务项目', role: '项目运维员', phone: '138xxxx1234', enabled: true },
  { id: 2, loginAccount: 'hz_operator', password: '123456', name: '吴嘉乐', org: '成都智慧水务项目', role: '项目运维员', phone: '139xxxx5566', enabled: true },
  { id: 3, loginAccount: 'hz_viewer',   password: '123456', name: '刘明',  org: '成都智慧水务项目', role: '数据查看员', phone: '150xxxx7788', enabled: false },
  { id: 4, loginAccount: 'hz_mgr',      password: '123456', name: '陈晓波', org: '成都智慧水务项目', role: '项目管理员', phone: '186xxxx4321', enabled: true },
];

/* ─────────────────── tree node component ─────────────────── */
function TreeItem({
  node, depth, selected, expanded, onSelect, onToggle,
}: {
  node: TreeNode; depth: number; selected: string;
  expanded: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const isSel   = selected === node.id;
  const isExp   = expanded.has(node.id);
  const hasKids = !!node.children?.length;

  const Icon =
    node.type === 'root'       ? <Globe      className="w-4 h-4 flex-shrink-0 text-blue-500" /> :
    node.type === 'integrator' ? <Building2  className="w-4 h-4 flex-shrink-0 text-amber-500" /> :
                                 <MapPin     className="w-4 h-4 flex-shrink-0 text-slate-400" />;

  return (
    <div>
      <div
        onClick={() => { onSelect(node.id); if (hasKids) onToggle(node.id); }}
        style={{ paddingLeft: `${10 + depth * 16}px` }}
        className={`flex items-center gap-1.5 h-9 pr-3 rounded-md cursor-pointer text-sm select-none transition-colors
          ${isSel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <span className="w-4 flex-shrink-0 flex items-center justify-center">
          {hasKids && (
            isExp
              ? <ChevronDown  className="w-3.5 h-3.5 text-slate-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          )}
        </span>
        {Icon}
        <span className="flex-1 truncate">{node.label}</span>
      </div>
      {hasKids && isExp && node.children!.map(c => (
        <TreeItem key={c.id} node={c} depth={depth + 1}
          selected={selected} expanded={expanded}
          onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

/* ─────────────────── toggle switch ─────────────────── */
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0
        ${enabled ? 'bg-blue-500' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
          ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

/* ─────────────────── more dropdown ─────────────────── */
function MoreMenu({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-0.5 text-sm text-blue-500 hover:text-blue-700 transition-colors"
      >
        更多 <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
          <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">修改</button>
          <button className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-slate-50 transition-colors">删除</button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── main page ─────────────────── */
export function UserManagement() {
  const [selected,  setSelected]  = useState('chengdu-water');
  const [expanded,  setExpanded]  = useState(new Set(['root', 'ceyike']));
  const [treeSearch, setTreeSearch] = useState('');
  const [openMore,  setOpenMore]  = useState<number | null>(null);
  const [users,     setUsers]     = useState<User[]>(USERS);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchName, setSearchName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [currentPage] = useState(1);
  const TOTAL = 12;

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const toggleUser = (id: number, val: boolean) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, enabled: val } : u));
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const allChecked = users.length > 0 && selectedIds.size === users.length;
  const toggleAll  = (checked: boolean) => setSelectedIds(checked ? new Set(users.map(u => u.id)) : new Set());

  /* breadcrumb from selected node */
  const crumbs = selected === 'chengdu-water'
    ? ['超级管理员', '测艺科技', '成都智慧水务项目']
    : selected === 'zitong'
    ? ['超级管理员', '测艺科技', '梓桐沟项目']
    : selected === 'ceyike'
    ? ['超级管理员', '测艺科技']
    : selected === 'yinghetong'
    ? ['超级管理员', '盈和通创']
    : ['超级管理员'];

  return (
    <div className="flex-1 min-h-0 flex bg-[#F3F4F6] overflow-hidden">

      {/* ── 左侧树 (22%) ── */}
      <div className="w-[22%] flex-shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
        {/* 搜索框 */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 h-8 px-3 border border-slate-300 rounded-md bg-white
            focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="搜索集成商或项目"
              value={treeSearch}
              onChange={e => setTreeSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* 树节点 */}
        <div className="flex-1 overflow-auto py-2 px-2">
          {TREE.map(n => (
            <TreeItem key={n.id} node={n} depth={0}
              selected={selected} expanded={expanded}
              onSelect={setSelected} onToggle={toggleExpand} />
          ))}
        </div>
      </div>

      {/* ── 右侧主工作区 (78%) ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden px-5 py-4 gap-3">

        {/* 面包屑 + 搜索条 + 新增按钮 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-5 py-3 flex-shrink-0">
          {/* 面包屑 */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-slate-300">›</span>}
                <span className={i === crumbs.length - 1 ? 'text-slate-700 font-medium' : 'text-slate-400'}>{c}</span>
              </span>
            ))}
          </div>

          {/* 搜索行 */}
          <div className="flex items-center gap-3">
            {/* 用户名称/账号 */}
            <div className="flex items-center gap-2 h-9 px-3 border border-slate-300 rounded-md bg-white
              focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="用户名称/登录账号"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* 角色 */}
            <div className="relative">
              <select
                value={searchRole}
                onChange={e => setSearchRole(e.target.value)}
                className="h-9 pl-3 pr-8 border border-slate-300 rounded-md text-sm text-slate-600 bg-white
                  focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 appearance-none w-36 transition-all"
              >
                <option value="">角色</option>
                <option value="admin">项目管理员</option>
                <option value="ops">项目运维员</option>
                <option value="viewer">数据查看员</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button className="h-9 px-5 bg-[#1890FF] hover:bg-blue-600 text-white text-sm font-medium rounded-md
              transition-colors shadow-sm flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              查询
            </button>

            <div className="flex-1" />

            <button className="h-9 px-4 bg-[#1890FF] hover:bg-blue-600 text-white text-sm font-medium rounded-md
              transition-colors shadow-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              新增本项目用户
            </button>
          </div>
        </div>

        {/* 核心数据表格 */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="h-11 sticky top-0 z-10 border-b border-slate-200"
                  style={{ background: '#FAFAFA' }}>
                  <th className="px-4 w-10 text-left">
                    <input type="checkbox" checked={allChecked}
                      onChange={e => toggleAll(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 accent-blue-500" />
                  </th>
                  {['登录账号', '登录密码', '用户名称', '所属层级', '系统角色', '手机号码', '状态', '操作'].map(h => (
                    <th key={h} className="px-4 text-left text-sm font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}
                    className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
                    style={{ height: '54px', background: idx % 2 === 1 ? '#FAFAFA' : '#fff' }}
                  >
                    {/* 复选框 */}
                    <td className="px-4">
                      <input type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="w-4 h-4 rounded border-slate-300 accent-blue-500" />
                    </td>

                    {/* 登录账号 */}
                    <td className="px-4">
                      <span className="text-sm font-medium text-slate-800">{user.loginAccount}</span>
                    </td>

                    {/* 登录密码 */}
                    <td className="px-4">
                      <span className="text-sm text-slate-400 tracking-widest">••••••</span>
                    </td>

                    {/* 用户名称 */}
                    <td className="px-4">
                      <span className="text-sm text-slate-800">{user.name}</span>
                    </td>

                    {/* 所属层级 */}
                    <td className="px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
                        bg-blue-50 text-blue-700 border border-blue-100">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {user.org}
                      </span>
                    </td>

                    {/* 系统角色 */}
                    <td className="px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                        bg-purple-50 text-purple-700 border border-purple-100">
                        {user.role}
                      </span>
                    </td>

                    {/* 手机号码 */}
                    <td className="px-4 text-sm text-slate-600">{user.phone}</td>

                    {/* 状态开关 */}
                    <td className="px-4">
                      <Toggle enabled={user.enabled} onChange={v => toggleUser(user.id, v)} />
                    </td>

                    {/* 操作 */}
                    <td className="px-4">
                      <div className="flex items-center gap-0.5 text-sm text-blue-500">
                        <button className="hover:text-blue-700 transition-colors px-1">编辑</button>
                        <span className="text-slate-200 select-none">|</span>
                        <button className="hover:text-blue-700 transition-colors px-1">分配角色</button>
                        <span className="text-slate-200 select-none">|</span>
                        <MoreMenu
                          open={openMore === user.id}
                          onToggle={() => setOpenMore(openMore === user.id ? null : user.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页器 */}
          <div className="flex-shrink-0 px-5 h-12 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              共 <span className="font-medium text-slate-700">{TOTAL}</span> 条数据
            </span>
            <div className="flex items-center gap-1">
              <button disabled
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border text-sm font-medium"
                style={{ borderColor: '#1890FF', background: '#1890FF', color: '#fff' }}>
                1
              </button>
              <button disabled
                className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed">
                <ChevronR className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-slate-500">{currentPage} / 1 页</span>
          </div>
        </div>
      </div>
    </div>
  );
}
