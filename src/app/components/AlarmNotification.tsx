import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, FolderOpen, MapPin, Plus,
  ChevronLeft, User, UserPlus, Lock,
} from 'lucide-react';

/* ─────────────────── types ─────────────────── */
type TabType = 'strategy' | 'contacts' | 'templates';
type TemplateType = 'sms' | 'email' | 'voice';

interface Strategy {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'internal' | 'external';
  isLocked?: boolean;
}

interface Template {
  id: string;
  title: string;
  channel: string;
  content: string;
}

/* ─────────────────── tree node ─────────────────── */
interface TreeNode {
  id: string;
  label: string;
  type: 'org' | 'project';
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    id: 'root', label: '超级管理员', type: 'org',
    children: [
      {
        id: 'ceyike', label: '测艺科技', type: 'org',
        children: [
          { id: 'jintang', label: '金堂水厂项目', type: 'project' },
        ],
      },
    ],
  },
];

/* ─────────────────── mock data ─────────────────── */
const STRATEGIES: Strategy[] = [
  { id: '1', name: '水位超限告警', condition: '数据超限', action: '短信预警', enabled: true },
  { id: '2', name: '暴雨预警通知', condition: '暴雨预警', action: '短信预警', enabled: true },
  { id: '3', name: '设备工况异常', condition: '工况预警', action: '短信预警', enabled: false },
];

const CONTACTS: Contact[] = [
  { id: '1', name: '张伟', phone: '13800000000', type: 'internal', isLocked: true },
  { id: '2', name: '李刚', phone: '13911112222', type: 'external' },
  { id: '3', name: '王芳', phone: '13922223333', type: 'external' },
];

const TEMPLATES: Template[] = [
  {
    id: '1',
    title: '设备离线通知',
    channel: '阿里云 SMS',
    content: '【系统通知】设备 ${deviceName} 于 ${time} 离线，请及时处理。',
  },
  {
    id: '2',
    title: '红色紧急调度',
    channel: '腾讯云 SMS',
    content: '[系统预警] ${projectName} 水位数据超限，目前水位为 ${value}，请查收。',
  },
  {
    id: '3',
    title: '每日数据汇总',
    channel: '阿里云 SMS',
    content: '【日报】${date} 项目 ${projectName} 设备运行正常，在线率 ${rate}。',
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
    node.type === 'org' ? <FolderOpen className="w-4 h-4 flex-shrink-0 text-amber-500" /> :
                          <MapPin className="w-4 h-4 flex-shrink-0 text-blue-400" />;

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

function VariableText({ text }: { text: string }) {
  const parts = text.split(/(\$\{[^}]+\})/g);
  return (
    <span className="text-sm text-[#595959]">
      {parts.map((part, idx) => {
        if (part.match(/\$\{[^}]+\}/)) {
          return (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mx-0.5"
              style={{ background: '#E6F7FF', color: '#096DD9' }}
            >
              {part}
            </span>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
}

/* ─────────────────── main page ─────────────────── */
export function AlarmNotification() {
  const [activeTab, setActiveTab] = useState<TabType>('strategy');
  const [selectedNode, setSelectedNode] = useState('jintang');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root', 'ceyike']));
  const [templateType, setTemplateType] = useState<TemplateType>('sms');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleNode = (id: string) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // 切换到模板页时折叠侧边栏
    if (tab === 'templates') {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  };

  const showSidebar = !sidebarCollapsed;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#F5F7FA] overflow-hidden">
      {/* ── 顶部Tab栏 ── */}
      <div className="flex-shrink-0 bg-white border-b border-[#E4E7ED] px-6">
        <div className="flex items-center gap-8">
          {[
            { key: 'strategy' as TabType, label: '告警策略' },
            { key: 'contacts' as TabType, label: '告警通讯录' },
            { key: 'templates' as TabType, label: '消息模板' },
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`py-4 text-sm font-medium transition-colors relative ${
                  isActive ? 'text-[#1890FF]' : 'text-[#595959] hover:text-[#262626]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1890FF] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 主体内容区 ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* 左侧导航树 */}
        {showSidebar && (
          <div className="w-[20%] flex-shrink-0 bg-white border-r border-[#E4E7ED] flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#E4E7ED]">
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
        )}

        {/* 折叠侧边栏按钮 */}
        {sidebarCollapsed && (
          <div className="w-12 flex-shrink-0 bg-white border-r border-[#E4E7ED] flex items-center justify-center">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 transition-colors"
              title="展开导航"
            >
              <ChevronRight className="w-4 h-4 text-[#8C8C8C]" />
            </button>
          </div>
        )}

        {/* 右侧内容区 */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Tab 1: 告警策略 */}
          {activeTab === 'strategy' && (
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg border border-[#E4E7ED] overflow-hidden"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* 标题栏 */}
                <div className="px-6 py-4 border-b border-[#E4E7ED] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#262626]">金堂水厂项目 - 告警规则</h2>
                  <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                    transition-colors flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    新建策略
                  </button>
                </div>

                {/* 表格 */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E4E7ED' }}>
                      {['策略名称', '触发条件', '执行动作', '状态', '操作'].map(col => (
                        <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-[#262626]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STRATEGIES.map(strategy => (
                      <tr key={strategy.id} className="hover:bg-[#FAFAFA] transition-colors"
                        style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#262626]">{strategy.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium"
                            style={{
                              fontFamily: 'SFMono-Regular, Consolas, monospace',
                              color: '#262626', background: '#F5F5F5', border: '1px solid #E4E7ED',
                            }}>
                            {strategy.condition}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#595959]">{strategy.action}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Switch enabled={strategy.enabled} onChange={() => {}} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors">
                              编辑
                            </button>
                            <span className="text-[#E4E7ED]">|</span>
                            <button className="text-sm text-[#F5222D] hover:text-[#FF4D4F] transition-colors">
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: 告警通讯录 */}
          {activeTab === 'contacts' && (
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg border border-[#E4E7ED] overflow-hidden"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* 标题栏 */}
                <div className="px-6 py-4 border-b border-[#E4E7ED] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#262626]">金堂水厂项目 - 本地联络人</h2>
                  <div className="flex items-center gap-3">
                    <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                      transition-colors flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      勾选系统内部人员
                    </button>
                    <button className="h-8 px-4 border border-[#D9D9D9] text-[#595959] hover:border-[#40A9FF]
                      hover:text-[#1890FF] text-sm rounded bg-white transition-colors flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4" />
                      新增外部联系人
                    </button>
                  </div>
                </div>

                {/* 表格 */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E4E7ED' }}>
                      {['姓名', '手机号', '人员属性', '操作'].map(col => (
                        <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-[#262626]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CONTACTS.map(contact => (
                      <tr key={contact.id} className="hover:bg-[#FAFAFA] transition-colors"
                        style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#262626]">{contact.name}</span>
                            {contact.isLocked && <Lock className="w-3.5 h-3.5 text-[#8C8C8C]" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#595959]">{contact.phone}</span>
                        </td>
                        <td className="px-6 py-4">
                          {contact.type === 'internal' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                              style={{ color: '#096DD9', background: '#E6F7FF', border: '1px solid #91D5FF' }}>
                              内部账号
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                              style={{ color: '#389E0D', background: '#F6FFED', border: '1px solid #B7EB8F' }}>
                              外部联系人
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {contact.type === 'internal' ? (
                            <button className="text-sm text-[#F5222D] hover:text-[#FF4D4F] transition-colors">
                              移出本级
                            </button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors">
                                编辑
                              </button>
                              <span className="text-[#E4E7ED]">|</span>
                              <button className="text-sm text-[#F5222D] hover:text-[#FF4D4F] transition-colors">
                                删除
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: 消息模板 */}
          {activeTab === 'templates' && (
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-lg border border-[#E4E7ED] overflow-hidden"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                {/* 顶部工具栏 */}
                <div className="px-6 py-4 border-b border-[#E4E7ED] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[
                      { key: 'sms' as TemplateType, label: '短信模板' },
                      { key: 'email' as TemplateType, label: '邮件模板' },
                      { key: 'voice' as TemplateType, label: '语音模板' },
                    ].map(type => (
                      <button
                        key={type.key}
                        onClick={() => setTemplateType(type.key)}
                        className={`h-8 px-4 text-sm font-medium rounded transition-colors ${
                          templateType === type.key
                            ? 'bg-[#262626] text-white'
                            : 'bg-transparent text-[#595959] hover:bg-[#F5F5F5]'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  <button className="h-8 px-4 bg-[#1890FF] hover:bg-[#40A9FF] text-white text-sm rounded
                    transition-colors flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    新建全局模板
                  </button>
                </div>

                {/* 表格 */}
                <table className="w-full border-collapse">
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #E4E7ED' }}>
                      {['模板标题', '内容预览', '操作'].map(col => (
                        <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-[#262626]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TEMPLATES.map(template => (
                      <tr key={template.id} className="hover:bg-[#FAFAFA] transition-colors"
                        style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#262626]">{template.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <VariableText text={template.content} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-sm text-[#1890FF] hover:text-[#40A9FF] transition-colors">
                              编辑
                            </button>
                            <span className="text-[#E4E7ED]">|</span>
                            <button className="text-sm text-[#F5222D] hover:text-[#FF4D4F] transition-colors">
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
