import { useState } from 'react';
import { Plus } from 'lucide-react';

/* ─────────────────── role list ─────────────────── */
interface Role {
  id: string;
  name: string;
  tag: string;
  tagColor: 'blue' | 'purple' | 'green' | 'gray';
  group: string;
  desc: string;
}

const ROLES: Role[] = [
  { id: 'super',    name: '超级管理员',     tag: '全局',   tagColor: 'blue',   group: '平台级角色',   desc: '拥有平台所有功能的最高权限，可管理所有集成商、项目及用户。' },
  { id: 'integra',  name: '集成商管理员',   tag: '集成商', tagColor: 'purple', group: '集成商级角色', desc: '可管理本集成商下所有项目及项目人员，无法跨集成商操作。' },
  { id: 'senior',   name: '项目高级运维员', tag: '项目',   tagColor: 'green',  group: '项目级角色',   desc: '拥有项目内的设备管理、告警处理等完整运维权限，不含系统配置权限。' },
  { id: 'readonly', name: '项目只读访客',   tag: '项目',   tagColor: 'gray',   group: '项目级角色',   desc: '仅允许查看设备和监测数据，无任何控制、修改设备和处理告警的权限。' },
];

const TAG_STYLE: Record<string, { text: string; bg: string; border: string }> = {
  blue:   { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  purple: { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  green:  { text: '#237804', bg: '#F6FFED', border: '#B7EB8F' },
  gray:   { text: '#595959', bg: '#F5F5F5', border: '#D9D9D9' },
};

/* ─────────────────── permission data ─────────────────── */
interface AtomPerm { id: string; label: string; highRisk: boolean; }
interface PagePerm  { id: string; label: string; perms: AtomPerm[]; }
interface ModulePerm { id: string; label: string; pages: PagePerm[]; }

const PERM_MODULES: ModulePerm[] = [
  {
    id: 'mod-home', label: '首页',
    pages: [
      { id: 'page-home', label: '首页', perms: [
        { id: 'home-view', label: '查看', highRisk: false },
      ]},
    ],
  },
  {
    id: 'mod-analysis', label: '监测数据与分析',
    pages: [
      { id: 'page-analysis', label: '监测数据与分析', perms: [
        { id: 'analysis-view',   label: '查看', highRisk: false },
        { id: 'analysis-export', label: '导出', highRisk: true  },
      ]},
    ],
  },
  {
    id: 'mod-alarm', label: '告警中心',
    pages: [
      { id: 'page-alarm-center', label: '告警处理台', perms: [
        { id: 'alarm-view',   label: '查看',     highRisk: false },
        { id: 'alarm-handle', label: '处理',     highRisk: true  },
        { id: 'alarm-batch',  label: '批量处理', highRisk: true  },
        { id: 'alarm-export', label: '导出',     highRisk: true  },
      ]},
      { id: 'page-alarm-rules', label: '告警规则', perms: [
        { id: 'arule-view',   label: '查看', highRisk: false },
        { id: 'arule-edit',   label: '编辑', highRisk: true  },
        { id: 'arule-toggle', label: '启停', highRisk: true  },
      ]},
      { id: 'page-alarm-notify', label: '告警通知管理', perms: [
        { id: 'anotify-view',     label: '查看',     highRisk: false },
        { id: 'anotify-strategy', label: '策略管理', highRisk: true  },
        { id: 'anotify-contact',  label: '通讯录管理', highRisk: true },
        { id: 'anotify-tpl',      label: '模板管理', highRisk: true  },
      ]},
    ],
  },
  {
    id: 'mod-device', label: '设备管理',
    pages: [
      { id: 'page-device-list', label: '设备列表', perms: [
        { id: 'dev-view',    label: '查看',     highRisk: false },
        { id: 'dev-config',  label: '配置',     highRisk: true  },
        { id: 'dev-upgrade', label: '固件升级', highRisk: true  },
        { id: 'dev-add',     label: '新增',     highRisk: true  },
        { id: 'dev-import',  label: '批量导入', highRisk: true  },
        { id: 'dev-export',  label: '导出',     highRisk: true  },
        { id: 'dev-gate',    label: '闸门控制', highRisk: true  },
        { id: 'dev-edit',    label: '编辑',     highRisk: true  },
        { id: 'dev-delete',  label: '删除',     highRisk: true  },
      ]},
      { id: 'page-task', label: '任务中心', perms: [
        { id: 'task-view',   label: '查看',     highRisk: false },
        { id: 'task-create', label: '新建',     highRisk: true  },
        { id: 'task-edit',   label: '编辑',     highRisk: true  },
        { id: 'task-toggle', label: '启停/重试', highRisk: true  },
        { id: 'task-delete', label: '删除',     highRisk: true  },
        { id: 'task-export', label: '导出',     highRisk: true  },
      ]},
      { id: 'page-data-push', label: '数据推送', perms: [
        { id: 'push-view',   label: '查看', highRisk: false },
        { id: 'push-add',    label: '新增', highRisk: true  },
        { id: 'push-edit',   label: '编辑', highRisk: true  },
        { id: 'push-toggle', label: '启停', highRisk: true  },
        { id: 'push-delete', label: '删除', highRisk: true  },
      ]},
    ],
  },
  {
    id: 'mod-project', label: '项目管理',
    pages: [
      { id: 'page-project', label: '项目管理', perms: [
        { id: 'proj-view',        label: '查看',     highRisk: false },
        { id: 'proj-view-device', label: '查看设备', highRisk: false },
        { id: 'proj-add',         label: '新增',     highRisk: true  },
        { id: 'proj-edit',        label: '编辑',     highRisk: true  },
        { id: 'proj-toggle',      label: '启停',     highRisk: true  },
        { id: 'proj-delete',      label: '删除',     highRisk: true  },
      ]},
    ],
  },
  {
    id: 'mod-system', label: '系统管理',
    pages: [
      { id: 'page-user', label: '用户管理', perms: [
        { id: 'user-view',   label: '查看',        highRisk: false },
        { id: 'user-add',    label: '新增',        highRisk: true  },
        { id: 'user-edit',   label: '编辑',        highRisk: true  },
        { id: 'user-toggle', label: '启停',        highRisk: true  },
        { id: 'user-reset',  label: '重置账号/密码', highRisk: true },
        { id: 'user-assign', label: '分配角色',    highRisk: true  },
        { id: 'user-delete', label: '删除',        highRisk: true  },
      ]},
      { id: 'page-role', label: '角色管理', perms: [
        { id: 'role-view',   label: '查看',     highRisk: false },
        { id: 'role-assign', label: '分配权限', highRisk: true  },
      ]},
      { id: 'page-devtype', label: '设备类型', perms: [
        { id: 'devtype-view',   label: '查看', highRisk: false },
        { id: 'devtype-add',    label: '新增', highRisk: true  },
        { id: 'devtype-edit',   label: '编辑', highRisk: true  },
        { id: 'devtype-delete', label: '删除', highRisk: true  },
      ]},
      { id: 'page-access-model', label: '接入物模型', perms: [
        { id: 'access-view',   label: '查看', highRisk: false },
        { id: 'access-add',    label: '新增', highRisk: true  },
        { id: 'access-edit',   label: '编辑', highRisk: true  },
        { id: 'access-toggle', label: '启停', highRisk: true  },
        { id: 'access-delete', label: '删除', highRisk: true  },
      ]},
      { id: 'page-push-model', label: '推送物模型', perms: [
        { id: 'pushmodel-view',   label: '查看', highRisk: false },
        { id: 'pushmodel-add',    label: '新增', highRisk: true  },
        { id: 'pushmodel-edit',   label: '编辑', highRisk: true  },
        { id: 'pushmodel-toggle', label: '启停', highRisk: true  },
        { id: 'pushmodel-delete', label: '删除', highRisk: true  },
      ]},
      { id: 'page-datatype', label: '数据类型', perms: [
        { id: 'datatype-view',   label: '查看', highRisk: false },
        { id: 'datatype-add',    label: '新增', highRisk: true  },
        { id: 'datatype-edit',   label: '编辑', highRisk: true  },
        { id: 'datatype-delete', label: '删除', highRisk: true  },
      ]},
      { id: 'page-notice', label: '通知公告', perms: [
        { id: 'notice-view',   label: '查看',      highRisk: false },
        { id: 'notice-pubret', label: '发布/撤回', highRisk: true  },
      ]},
      { id: 'page-loginlog', label: '登录日志', perms: [
        { id: 'loginlog-view',   label: '查看', highRisk: false },
        { id: 'loginlog-export', label: '导出', highRisk: true  },
      ]},
      { id: 'page-oplog', label: '操作日志', perms: [
        { id: 'oplog-view',   label: '查看', highRisk: false },
        { id: 'oplog-detail', label: '详情', highRisk: false },
        { id: 'oplog-export', label: '导出', highRisk: true  },
      ]},
    ],
  },
  {
    id: 'mod-feedback', label: '问题反馈',
    pages: [
      { id: 'page-feedback', label: '问题反馈', perms: [
        { id: 'fb-view',   label: '查看',     highRisk: false },
        { id: 'fb-submit', label: '提交/撤销', highRisk: false },
        { id: 'fb-handle', label: '处理',     highRisk: true  },
      ]},
    ],
  },
];

/* ─────────────────── helpers ─────────────────── */
function allPermIds(modules: ModulePerm[]) {
  return modules.flatMap(m => m.pages.flatMap(p => p.perms.map(a => a.id)));
}
function modulePermIds(m: ModulePerm) { return m.pages.flatMap(p => p.perms.map(a => a.id)); }
function pagePermIds(p: PagePerm)     { return p.perms.map(a => a.id); }

type TriState = 'checked' | 'indeterminate' | 'unchecked';
function triState(ids: string[], checked: Set<string>): TriState {
  const n = ids.filter(id => checked.has(id)).length;
  if (n === 0) return 'unchecked';
  if (n === ids.length) return 'checked';
  return 'indeterminate';
}

/* ─────────────────── default checked sets ─────────────────── */
const ALL_IDS  = new Set(allPermIds(PERM_MODULES));
const VIEW_IDS = new Set(allPermIds(PERM_MODULES).filter(id => id.endsWith('-view')));

const SENIOR_IDS = new Set([
  'home-view',
  'analysis-view', 'analysis-export',
  'alarm-view', 'alarm-handle', 'alarm-batch', 'alarm-export',
  'arule-view', 'arule-edit', 'arule-toggle',
  'anotify-view', 'anotify-strategy', 'anotify-contact', 'anotify-tpl',
  'dev-view', 'dev-config', 'dev-upgrade', 'dev-add', 'dev-import', 'dev-export', 'dev-edit',
  'task-view', 'task-create', 'task-edit', 'task-toggle', 'task-delete', 'task-export',
  'push-view', 'push-add', 'push-edit', 'push-toggle',
  'proj-view', 'proj-view-device',
  'user-view', 'role-view',
  'fb-view', 'fb-submit',
]);

const READONLY_IDS = new Set([
  'home-view',
  'analysis-view',
  'alarm-view',
  'arule-view',
  'anotify-view',
  'dev-view',
  'task-view',
  'push-view',
  'proj-view', 'proj-view-device',
  'user-view', 'role-view',
  'fb-view',
]);

function defaultChecked(roleId: string): Set<string> {
  if (roleId === 'super')   return new Set(ALL_IDS);
  if (roleId === 'integra') return new Set(ALL_IDS);
  if (roleId === 'senior')  return new Set(SENIOR_IDS);
  return new Set(READONLY_IDS);
}

/* ─────────────────── checkbox ─────────────────── */
function Checkbox({ state, onChange }: { state: TriState; onChange: () => void }) {
  const filled = state !== 'unchecked';
  return (
    <button
      onClick={onChange}
      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
      style={{
        borderColor: filled ? '#1890FF' : '#D9D9D9',
        background:  filled ? '#1890FF' : '#fff',
      }}
    >
      {state === 'checked' && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {state === 'indeterminate' && (
        <div className="w-2 h-0.5 bg-white rounded-full" />
      )}
    </button>
  );
}

/* ─────────────────── toggle switch ─────────────────── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative inline-flex items-center rounded-full transition-colors flex-shrink-0"
      style={{ width: 32, height: 18, background: on ? '#1890FF' : '#D9D9D9' }}>
      <span className="absolute rounded-full bg-white shadow transition-transform"
        style={{ width: 14, height: 14, transform: on ? 'translateX(16px)' : 'translateX(2px)' }} />
    </button>
  );
}

/* ─────────────────── permission panel ─────────────────── */
function PermPanel({ checked, onChange }: {
  checked: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const [onlyGranted, setOnlyGranted] = useState(false);

  const totalPerms   = allPermIds(PERM_MODULES).length;
  const grantedPerms = allPermIds(PERM_MODULES).filter(id => checked.has(id)).length;

  const toggleModule = (mod: ModulePerm) => {
    const ids  = modulePermIds(mod);
    const st   = triState(ids, checked);
    const next = new Set(checked);
    if (st === 'checked') ids.forEach(id => next.delete(id));
    else                  ids.forEach(id => next.add(id));
    onChange(next);
  };

  const togglePage = (page: PagePerm) => {
    const ids  = pagePermIds(page);
    const st   = triState(ids, checked);
    const next = new Set(checked);
    if (st === 'checked') ids.forEach(id => next.delete(id));
    else                  ids.forEach(id => next.add(id));
    onChange(next);
  };

  const togglePerm = (id: string) => {
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  };

  const visibleModules = onlyGranted
    ? PERM_MODULES.filter(m => modulePermIds(m).some(id => checked.has(id)))
    : PERM_MODULES;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* toolbar */}
      <div className="flex-shrink-0 px-6 py-2.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Toggle on={onlyGranted} onChange={() => setOnlyGranted(v => !v)} />
          <span className="text-sm text-slate-600">只显示已授权</span>
        </div>
        <span className="text-sm text-slate-500">
          已授权&nbsp;
          <span className="font-semibold text-[#1890FF]">{grantedPerms}</span>
          &nbsp;/&nbsp;{totalPerms}
        </span>
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse" style={{ fontSize: '13px' }}>
          <tbody>
            {visibleModules.map(mod => {
              const modIds    = modulePermIds(mod);
              const modChecked = modIds.filter(id => checked.has(id)).length;
              const modTotal   = modIds.length;

              const visiblePages = onlyGranted
                ? mod.pages.filter(p => pagePermIds(p).some(id => checked.has(id)))
                : mod.pages;

              return [
                /* ── module header row ── */
                <tr key={`mod-${mod.id}`} style={{ background: '#FAFAFA', borderTop: '1px solid #F0F0F0' }}>
                  <td colSpan={2} className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        state={triState(modIds, checked)}
                        onChange={() => toggleModule(mod)}
                      />
                      <span className="font-semibold text-[#262626]" style={{ fontSize: '13px' }}>{mod.label}</span>
                      <span className="text-[#1890FF] font-medium" style={{ fontSize: '12px' }}>
                        {modChecked}/{modTotal}
                      </span>
                    </div>
                  </td>
                </tr>,

                /* ── page rows ── */
                ...visiblePages.map(page => {
                  const pgIds = pagePermIds(page);
                  return (
                    <tr key={page.id}
                      className="hover:bg-[#FAFAFA] transition-colors"
                      style={{ borderBottom: '1px solid #F5F5F5' }}>

                      {/* page name */}
                      <td className="px-4 py-2.5 align-middle"
                        style={{ width: 200, minWidth: 200, borderRight: '1px solid #F0F0F0' }}>
                        <div className="flex items-center gap-2 pl-5">
                          <Checkbox
                            state={triState(pgIds, checked)}
                            onChange={() => togglePage(page)}
                          />
                          <span className="text-[#595959]">{page.label}</span>
                        </div>
                      </td>

                      {/* permissions */}
                      <td className="px-4 py-2.5 align-middle">
                        <div className="flex items-center flex-wrap gap-x-5 gap-y-1.5">
                          {page.perms.map(perm => {
                            const isChecked = checked.has(perm.id);
                            return (
                              <label key={perm.id}
                                className="flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap">
                                <Checkbox
                                  state={isChecked ? 'checked' : 'unchecked'}
                                  onChange={() => togglePerm(perm.id)}
                                />
                                <span className="text-[#262626] leading-none" style={{ fontSize: '12px' }}>{perm.label}</span>
                                {perm.highRisk && (
                                  <span className="text-[#BFBFBF] leading-none" style={{ fontSize: '12px' }}>· 高风险</span>
                                )}
                              </label>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                }),
              ];
            })}
          </tbody>
        </table>
      </div>
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
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[3]);
  const [checked, setChecked]           = useState<Set<string>>(defaultChecked('readonly'));

  const selectRole = (role: Role) => {
    setSelectedRole(role);
    setChecked(defaultChecked(role.id));
  };

  const groups = [...new Set(ROLES.map(r => r.group))];

  return (
    <div className="flex-1 min-h-0 flex bg-[#F3F4F6] overflow-hidden p-5 gap-4">

      {/* ── 左侧角色列表 ── */}
      <div className="w-[28%] flex-shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">角色列表</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#1890FF] hover:bg-blue-600
            text-white transition-colors flex-shrink-0" title="新增角色">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {groups.map(group => (
            <div key={group}>
              <GroupLabel label={group} />
              {ROLES.filter(r => r.group === group).map(role => {
                const tc = TAG_STYLE[role.tagColor];
                const isActive = selectedRole.id === role.id;
                return (
                  <button key={role.id} onClick={() => selectRole(role)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 transition-colors rounded-md mx-1 relative"
                    style={{
                      width: 'calc(100% - 8px)',
                      background: isActive ? '#E6F7FF' : 'transparent',
                      borderLeft: isActive ? '3px solid #1890FF' : '3px solid transparent',
                    }}>
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

      {/* ── 右侧权限配置 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">

        {/* role header */}
        <div className="px-6 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-1.5">
            <h2 className="text-xl font-bold text-slate-900">{selectedRole.name}</h2>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <button className="h-8 px-4 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm rounded-md transition-colors">
                编辑基本信息
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed max-w-2xl">{selectedRole.desc}</p>
          <div className="border-t border-slate-100" />
        </div>

        {/* section title */}
        <div className="px-6 py-3 flex-shrink-0 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">菜单与功能权限</h3>
        </div>

        {/* perm panel */}
        <PermPanel checked={checked} onChange={setChecked} />

        {/* footer */}
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button className="h-9 px-5 border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-md transition-colors">
            取消
          </button>
          <button className="h-9 px-5 bg-[#1890FF] hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors shadow-sm">
            保存权限配置
          </button>
        </div>
      </div>
    </div>
  );
}
