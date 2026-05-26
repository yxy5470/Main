import React, { useState } from 'react';
import { Copy, ChevronDown, Plus, Upload, Download, X, Grid3x3, List, QrCode, Signal, Star, ChevronUp } from 'lucide-react';
import { TreeSelect } from './TreeSelect';

interface Device {
  id: number;
  sn: string;
  imei: string;
  productType: string;
  project: string;
  locationName: string;
  status: 'online' | 'offline';
  hasAlert: boolean;
  positionType: string;
  latitude: number;
  longitude: number;
}

type SortField = 'sn' | 'imei' | 'locationName' | 'productType' | 'project' | 'status';
type SortOrder = 'asc' | 'desc';

const initialDevices: Device[] = [
  { id: 1, sn: 'CR120251120001', imei: '868381079719402', productType: '遥测终端机', project: '金堂水厂流量监测', locationName: '观测场1号', status: 'online', hasAlert: true, positionType: '自动定位', latitude: 30.774069, longitude: 103.990207 },
  { id: 2, sn: 'SN-10024', imei: '860720050001235', productType: '数据采集器', project: '空港水厂取水监测', locationName: '水厂监测点A', status: 'online', hasAlert: false, positionType: '手动定位', latitude: 30.574069, longitude: 103.890207 },
  { id: 3, sn: 'SN-10025', imei: '860720050001236', productType: '遥测终端机', project: '观测场气象监测', locationName: '气象站B', status: 'offline', hasAlert: false, positionType: '自动定位', latitude: 30.674069, longitude: 103.790207 },
  { id: 4, sn: 'SN-10026', imei: '860720050001237', productType: '智能网关', project: '德阳文庙环境监测', locationName: '环境监测点C', status: 'online', hasAlert: true, positionType: '自动定位', latitude: 30.874069, longitude: 103.690207 },
  { id: 5, sn: 'SN-10027', imei: '860720050001238', productType: '遥测终端机', project: '渠县闸门控制系统', locationName: '闸门控制点D', status: 'offline', hasAlert: false, positionType: '手动定位', latitude: 30.974069, longitude: 103.590207 },
  { id: 6, sn: 'SN-10028', imei: '860720050001239', productType: '数据采集器', project: '都江堰轨道交通', locationName: '轨道站点E', status: 'online', hasAlert: false, positionType: '自动定位', latitude: 31.074069, longitude: 103.490207 },
];

export function DeviceManagement() {
  const [projectFilter, setProjectFilter] = useState('1-1');
  const [snSearch, setSnSearch] = useState('');
  const [imeiSearch, setImeiSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showAdvancedMenu, setShowAdvancedMenu] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showQrTooltip, setShowQrTooltip] = useState<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [showListMoreMenu, setShowListMoreMenu] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('sn');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const projectTreeData = [
    {
      id: '1',
      label: '四川省水利项目',
      children: [
        { id: '1-1', label: '德阳文庙监测点' },
        { id: '1-2', label: '绵阳水文站' }
      ]
    },
    {
      id: '2',
      label: '广东省气象项目',
      children: [
        { id: '2-1', label: '广州观测站' },
        { id: '2-2', label: '深圳监测点' }
      ]
    }
  ];

  const totalItems = 113;
  const totalPages = Math.ceil(totalItems / pageSize);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(new Set(devices.map(d => d.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleSelectItem = (id: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        // Clipboard API not available, silently fail
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedDevices = () => {
    const sorted = [...devices].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // 转换为字符串进行比较
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr, 'zh-CN');
      } else {
        return bStr.localeCompare(aStr, 'zh-CN');
      }
    });
    return sorted;
  };

  const sortedDevices = getSortedDevices();

  return (
    <div className="size-full bg-[#F3F4F6] overflow-auto px-8 py-6">
      {/* 顶部搜索筛选区卡片 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex items-center gap-3">
          <TreeSelect
            data={projectTreeData}
            value={projectFilter}
            onChange={setProjectFilter}
            placeholder="请选择项目"
          />

          <div className="relative">
            <input
              type="text"
              placeholder="设备 S/N"
              value={snSearch}
              onChange={(e) => setSnSearch(e.target.value)}
              className="w-48 h-9 px-3 py-1.5 pr-9 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
            {snSearch && (
              <button
                onClick={() => setSnSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-500 text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="TNS/IMEI"
              value={imeiSearch}
              onChange={(e) => setImeiSearch(e.target.value)}
              className="w-48 h-9 px-3 py-1.5 pr-9 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
            />
            {imeiSearch && (
              <button
                onClick={() => setImeiSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-slate-400 hover:bg-slate-500 text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            value={productTypeFilter}
            onChange={(e) => setProductTypeFilter(e.target.value)}
            className="h-9 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          >
            <option value="">产品类型</option>
            <option value="terminal">遥测终端机</option>
            <option value="collector">数据采集器</option>
            <option value="gateway">智能网关</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          >
            <option value="">状态</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
          </select>

          <button className="h-9 px-4 py-1.5 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium">
            查询
          </button>

          <button className="h-9 px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium">
            重置
          </button>
        </div>
      </div>

      {/* 数据表格/卡片卡片 */}
      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        {/* 工具栏 */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 新增下拉按钮 */}
            <div className="relative">
              <button
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                className="inline-flex items-center gap-2 h-9 px-4 py-1.5 bg-[#3B82F6] text-white rounded hover:bg-blue-600 transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>新增</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showAddDropdown && (
                <div className="absolute left-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded shadow-lg z-10">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    手动添加
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    批量导入
                  </button>
                </div>
              )}
            </div>

            <button className="inline-flex items-center gap-2 h-9 px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium">
              <Download className="w-4 h-4" />
              <span>导出</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <div className="relative">
                <button
                  onClick={() => setShowAdvancedMenu(!showAdvancedMenu)}
                  className="inline-flex items-center gap-2 h-9 px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors font-medium"
                >
                  <span>高级选项</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showAdvancedMenu && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded shadow-lg z-10">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      批量转移
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      批量删除
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      批量升级
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 视图切换控件 */}
            <div className="flex items-center bg-slate-100 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 网格卡片视图 */}
        {viewMode === 'grid' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDevices.map((device) => (
                <div
                  key={device.id}
                  className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* 第一层：卡片头部 */}
                  <div className="p-4 flex items-start gap-3">
                    {/* 左侧设备图标 */}
                    <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 bg-[#3B82F6] rounded"></div>
                    </div>

                    {/* 中间名称和状态 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-slate-900 mb-2 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {device.locationName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                          device.status === 'online'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            device.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                          }`}></div>
                          {device.status === 'online' ? '在线' : '离线'}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
                          {device.positionType}
                        </span>
                        {device.hasAlert && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-50 text-red-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                            告警中
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 右上角图标 */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="relative">
                        <button
                          onMouseEnter={() => setShowQrTooltip(device.id)}
                          onMouseLeave={() => setShowQrTooltip(null)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        {showQrTooltip === device.id && (
                          <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-10 w-32">
                            <div className="w-24 h-24 bg-slate-900 mb-2"></div>
                            <p className="text-xs text-slate-600 text-center">扫码核对IMEI</p>
                          </div>
                        )}
                      </div>
                      <Signal className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                  </div>

                  {/* 第二层：设备参数详情 */}
                  <div className="px-4 pb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">S/N：</span>
                      <span className="text-slate-900 font-medium">{device.sn}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">TNS/IMEI：</span>
                      <span className="text-slate-900 font-medium">{device.imei}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">经纬度：</span>
                      <span className="text-slate-900 font-medium">{device.longitude}, {device.latitude}</span>
                    </div>
                  </div>

                  {/* 第三层：操作栏 */}
                  <div className="border-t border-slate-100">
                    <div className="flex items-center divide-x divide-slate-200">
                      <button className="flex-1 py-2.5 text-xs text-[#3B82F6] hover:bg-slate-50 transition-colors font-medium">
                        查看数据
                      </button>
                      <button className="flex-1 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                        配置
                      </button>
                      <button className="flex-1 py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                        详情
                      </button>
                      <div className="flex-1 relative">
                        <button
                          onClick={() => setShowMoreMenu(showMoreMenu === device.id ? null : device.id)}
                          className="w-full py-2.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium flex items-center justify-center gap-1"
                        >
                          更多
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {showMoreMenu === device.id && (
                          <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-slate-200 rounded shadow-lg z-10">
                            <button className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition-colors">
                              修改
                            </button>
                            <button className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-slate-50 transition-colors">
                              删除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-white h-12">
                  <th className="px-6 text-left">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                    />
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('sn')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      S/N
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'sn' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'sn' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('imei')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      TNS/IMEI
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'imei' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'imei' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('locationName')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      监测点位名称
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'locationName' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'locationName' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('productType')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      产品类型
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'productType' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'productType' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('project')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      所属项目
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'project' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'project' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-slate-900"
                    >
                      状态
                      <div className="flex flex-col">
                        <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === 'status' && sortOrder === 'asc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                        <ChevronDown className={`w-3 h-3 ${sortField === 'status' && sortOrder === 'desc' ? 'text-[#3B82F6]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  </th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {sortedDevices.map((device) => (
                  <tr
                    key={device.id}
                    className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors"
                    style={{ height: '52px' }}
                  >
                    <td className="px-6">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(device.id)}
                        onChange={() => toggleSelectItem(device.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[#3B82F6] focus:ring-[#3B82F6]"
                      />
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-900">{device.sn}</span>
                        <button
                          onClick={() => copyToClipboard(device.sn)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-900">{device.imei}</span>
                        <button
                          onClick={() => copyToClipboard(device.imei)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6">
                      <span className="text-sm text-slate-900">{device.locationName}</span>
                    </td>
                    <td className="px-6">
                      <span className="text-sm text-slate-900">{device.productType}</span>
                    </td>
                    <td className="px-6">
                      <span className="text-sm text-slate-900">{device.project}</span>
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            device.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            device.status === 'online' ? 'text-green-600' : 'text-slate-500'
                          }`}
                        >
                          {device.status === 'online' ? '在线' : '离线'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6">
                      <div className="flex items-center gap-3">
                        <button className="text-sm text-[#3B82F6] hover:text-blue-600 font-medium">
                          详情
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowListMoreMenu(showListMoreMenu === device.id ? null : device.id)}
                            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 font-medium"
                          >
                            更多
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          {showListMoreMenu === device.id && (
                            <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded shadow-lg z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                修改
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50 transition-colors">
                                删除
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页器 */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            共 {totalItems} 条
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lt;
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === page
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-2 text-slate-400">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === totalPages
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 rounded text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &gt;
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            >
              <option value={10}>10 条/页</option>
              <option value={20}>20 条/页</option>
              <option value={50}>50 条/页</option>
              <option value={100}>100 条/页</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
