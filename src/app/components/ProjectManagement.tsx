import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Minus } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  status: 'normal' | 'inactive';
  contact: string;
  phone: string;
}

interface ProjectGroup {
  id: number;
  name: string;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  status: 'normal' | 'inactive';
  contact: string;
  phone: string;
  expanded: boolean;
  projects: Project[];
}

const initialProjects: ProjectGroup[] = [
  {
    id: 1,
    name: '四川省水利项目',
    totalDevices: 48,
    onlineDevices: 45,
    offlineDevices: 3,
    status: 'normal',
    contact: '张伟',
    phone: '138-0000-1234',
    expanded: true,
    projects: [
      {
        id: 11,
        name: '德阳文庙监测点',
        totalDevices: 14,
        onlineDevices: 12,
        offlineDevices: 2,
        status: 'normal',
        contact: '李华',
        phone: '139-1111-5678',
      },
      {
        id: 12,
        name: '空港水厂取水监测',
        totalDevices: 18,
        onlineDevices: 18,
        offlineDevices: 0,
        status: 'normal',
        contact: '王芳',
        phone: '137-2222-9012',
      },
      {
        id: 13,
        name: '金堂水厂流量监测',
        totalDevices: 16,
        onlineDevices: 15,
        offlineDevices: 1,
        status: 'normal',
        contact: '赵敏',
        phone: '136-3333-4567',
      },
    ],
  },
  {
    id: 2,
    name: '环境监测系统',
    totalDevices: 33,
    onlineDevices: 32,
    offlineDevices: 1,
    status: 'normal',
    contact: '刘强',
    phone: '136-4444-3456',
    expanded: false,
    projects: [
      {
        id: 21,
        name: '观测场气象监测',
        totalDevices: 8,
        onlineDevices: 8,
        offlineDevices: 0,
        status: 'normal',
        contact: '陈伟',
        phone: '135-5555-7890',
      },
      {
        id: 22,
        name: '威远河口灌区',
        totalDevices: 25,
        onlineDevices: 24,
        offlineDevices: 1,
        status: 'normal',
        contact: '孙丽',
        phone: '134-6666-1234',
      },
    ],
  },
  {
    id: 3,
    name: '基础设施监控',
    totalDevices: 33,
    onlineDevices: 28,
    offlineDevices: 5,
    status: 'normal',
    contact: '周杰',
    phone: '132-7777-5678',
    expanded: false,
    projects: [
      {
        id: 31,
        name: '渠县闸门控制系统',
        totalDevices: 13,
        onlineDevices: 10,
        offlineDevices: 3,
        status: 'normal',
        contact: '吴雪',
        phone: '131-8888-9012',
      },
      {
        id: 32,
        name: '都江堰轨道交通',
        totalDevices: 20,
        onlineDevices: 18,
        offlineDevices: 2,
        status: 'normal',
        contact: '郑涛',
        phone: '130-9999-3456',
      },
    ],
  },
];

export function ProjectManagement() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState<ProjectGroup[]>(initialProjects);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set([11, 12]));

  const toggleExpand = (id: number) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, expanded: !project.expanded } : project
      )
    );
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set<number>();
      projects.forEach(p => {
        allIds.add(p.id);
        p.projects.forEach(sub => allIds.add(sub.id));
      });
      setSelectedItems(allIds);
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleSelectParent = (groupId: number) => {
    const group = projects.find(p => p.id === groupId);
    if (!group) return;

    const newSelected = new Set(selectedItems);
    const childIds = group.projects.map(p => p.id);
    const allSelected = [groupId, ...childIds].every(id => selectedItems.has(id));

    if (allSelected) {
      newSelected.delete(groupId);
      childIds.forEach(id => newSelected.delete(id));
    } else {
      newSelected.add(groupId);
      childIds.forEach(id => newSelected.add(id));
    }

    setSelectedItems(newSelected);
  };

  const toggleSelectChild = (groupId: number, childId: number) => {
    const newSelected = new Set(selectedItems);

    if (newSelected.has(childId)) {
      newSelected.delete(childId);
    } else {
      newSelected.add(childId);
    }

    const group = projects.find(p => p.id === groupId);
    if (group) {
      const allChildrenSelected = group.projects.every(p => newSelected.has(p.id));
      if (allChildrenSelected) {
        newSelected.add(groupId);
      } else {
        newSelected.delete(groupId);
      }
    }

    setSelectedItems(newSelected);
  };

  const isParentIndeterminate = (groupId: number) => {
    const group = projects.find(p => p.id === groupId);
    if (!group) return false;

    const childIds = group.projects.map(p => p.id);
    const selectedChildren = childIds.filter(id => selectedItems.has(id));

    return selectedChildren.length > 0 && selectedChildren.length < childIds.length;
  };

  return (
    <div className="size-full bg-[#F3F4F6] overflow-auto px-8 py-6">
      {/* 顶部操作栏卡片 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="输入项目名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-80 px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            >
              <option value="all">全部状态</option>
              <option value="normal">正常</option>
              <option value="inactive">停用</option>
            </select>
          </div>

          <button className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium">
            <Plus className="w-4 h-4" />
            <span>新建项目</span>
          </button>
        </div>
      </div>

      {/* 数据表格卡片 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-white h-14">
                <th className="px-6 text-left">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                  />
                </th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">项目名称</th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">设备总数</th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">在线/离线状况</th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">项目状态</th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">联系人</th>
                <th className="px-6 text-left text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((group) => (
                <React.Fragment key={group.id}>
                  {/* 父级行 */}
                  <tr className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors h-14">
                    <td className="px-6">
                      {isParentIndeterminate(group.id) ? (
                        <div
                          onClick={() => toggleSelectParent(group.id)}
                          className="w-4 h-4 rounded bg-[#3B82F6] border border-[#3B82F6] flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(group.id)}
                          onChange={() => toggleSelectParent(group.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                        />
                      )}
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(group.id)}
                          className="flex-shrink-0"
                        >
                          {group.expanded ? (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                        <span className="text-sm font-semibold text-slate-900">{group.name}</span>
                      </div>
                    </td>
                    <td className="px-6">
                      <span className="text-sm text-slate-700">{group.totalDevices}</span>
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-slate-700">{group.onlineDevices}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                          <span className="text-sm text-slate-700">{group.offlineDevices}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        正常
                      </span>
                    </td>
                    <td className="px-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{group.contact}</span>
                        <span className="text-xs text-slate-500">{group.phone}</span>
                      </div>
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-3">
                        <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">
                          查看设备
                        </button>
                        <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">
                          编辑
                        </button>
                        <button className="text-slate-600 hover:text-slate-900">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* 子级行 */}
                  {group.expanded &&
                    group.projects.map((project) => (
                      <tr
                        key={project.id}
                        className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors h-14"
                      >
                        <td className="px-6">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(project.id)}
                            onChange={() => toggleSelectChild(group.id, project.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                          />
                        </td>
                        <td className="px-6">
                          <div className="pl-8">
                            <span className="text-sm text-slate-900">{project.name}</span>
                          </div>
                        </td>
                        <td className="px-6">
                          <span className="text-sm text-slate-700">{project.totalDevices}</span>
                        </td>
                        <td className="px-6">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-slate-700">{project.onlineDevices}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                              <span className="text-sm text-slate-700">{project.offlineDevices}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            正常
                          </span>
                        </td>
                        <td className="px-6">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-900">{project.contact}</span>
                            <span className="text-xs text-slate-500">{project.phone}</span>
                          </div>
                        </td>
                        <td className="px-6">
                          <div className="flex items-center gap-3">
                            <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">
                              查看设备
                            </button>
                            <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">
                              编辑
                            </button>
                            <button className="text-slate-600 hover:text-slate-900">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
