import React, { useState } from 'react';
import { Copy, ChevronDown, Plus, Download, X, Grid3x3, List, Star, ChevronUp, AlertTriangle, ExternalLink } from 'lucide-react';
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
  accessProtocol: string;
  pushProtocol: string;
}

type SortField = 'sn' | 'imei' | 'locationName' | 'productType' | 'project' | 'status';
type SortOrder = 'asc' | 'desc';

const initialDevices: Device[] = [
  { id: 1, sn: 'CR120251120001', imei: '868381079719402', productType: '遥测终端机', project: '金堂水厂流量监测', locationName: '观测场1号', status: 'online', hasAlert: true, positionType: '自动定位', latitude: 30.774069, longitude: 103.990207, accessProtocol: '四川水文规约', pushProtocol: 'MQTT' },
  { id: 2, sn: 'SN-10024', imei: '860720050001235', productType: '数据采集器', project: '空港水厂取水监测', locationName: '水厂监测点A', status: 'online', hasAlert: false, positionType: '手动定位', latitude: 30.574069, longitude: 103.890207, accessProtocol: 'MQTT', pushProtocol: '私有协议' },
  { id: 3, sn: 'SN-10025', imei: '860720050001236', productType: '遥测终端机', project: '观测场气象监测', locationName: '气象站B', status: 'offline', hasAlert: false, positionType: '自动定位', latitude: 30.674069, longitude: 103.790207, accessProtocol: 'SL651', pushProtocol: 'MQTT' },
  { id: 4, sn: 'SN-10026', imei: '860720050001237', productType: '智能网关', project: '德阳文庙环境监测', locationName: '环境监测点C', status: 'online', hasAlert: true, positionType: '自动定位', latitude: 30.874069, longitude: 103.690207, accessProtocol: '私有协议', pushProtocol: '四川水文规约' },
  { id: 5, sn: 'SN-10027', imei: '860720050001238', productType: '遥测终端机', project: '渠县闸门控制系统', locationName: '闸门控制点D', status: 'offline', hasAlert: false, positionType: '手动定位', latitude: 30.974069, longitude: 103.590207, accessProtocol: 'SL651', pushProtocol: 'SL651' },
  { id: 6, sn: 'SN-10028', imei: '860720050001239', productType: '数据采集器', project: '都江堰轨道交通', locationName: '轨道站点E', status: 'online', hasAlert: false, positionType: '自动定位', latitude: 31.074069, longitude: 103.490207, accessProtocol: 'MQTT', pushProtocol: 'MQTT' },
];

const PROTOCOL_STYLES: Record<string, { text: string; bg: string; border: string }> = {
  'MQTT':       { text: '#096DD9', bg: '#E6F7FF', border: '#91D5FF' },
  '私有协议':    { text: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  '四川水文规约': { text: '#006D75', bg: '#E6FFFB', border: '#87E8DE' },
  'SL651':      { text: '#7D4E00', bg: '#FFF7E6', border: '#FFD591' },
};

function ProtocolTag({ value }: { value: string }) {
  const s = PROTOCOL_STYLES[value] ?? { text: '#595959', bg: '#F5F5F5', border: '#D9D9D9' };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap"
      style={{ color: s.text, background: s.bg, borderColor: s.border }}>
      {value}
    </span>
  );
}

export function DeviceList() {
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
    <div className="size-full bg-[#F3F4F6] flex flex-col px-8 py-6 overflow-hidden">
      {/* 顶部搜索筛选区卡片 */}
      <div className="flex-shrink-0 bg-white rounded shadow-sm border border-slate-200 p-4 mb-6">
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
      <div className="flex-1 min-h-0 bg-white rounded shadow-sm border border-slate-200 flex flex-col overflow-hidden">
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
          <div className="flex-1 overflow-auto p-5">
            <div className="grid grid-cols-3 gap-3">
              {sortedDevices.map((device) => {
                const online = device.status === 'online';
                const offline = device.status === 'offline';
                return (
                  <div
                    key={device.id}
                    className={`bg-white rounded-lg flex flex-col overflow-hidden
                      ${device.hasAlert ? 'border border-red-200 shadow-sm' : 'border border-slate-200 shadow-sm'}`}
                  >
                    {/* ── 1. 头部：设备图标 + 标题 + 右侧小图标 ── */}
                    <div className="px-4 pt-4 pb-0 flex items-center gap-2.5">
                      {/* 设备 icon */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                        ${offline ? 'bg-slate-100' : 'bg-[#3B82F6]'}`}>
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
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="1" y="11" width="3" height="4" rx="0.5" fill={online ? '#3B82F6' : '#D1D5DB'} />
                          <rect x="5.5" y="7.5" width="3" height="7.5" rx="0.5" fill={online ? '#3B82F6' : '#D1D5DB'} />
                          <rect x="10" y="4" width="3" height="11" rx="0.5" fill={online ? '#3B82F6' : '#D1D5DB'} />
                        </svg>
                      </div>
                    </div>

                    {/* ── 2. 工况状态（预留两行） ── */}
                    <div className="px-4 pt-2.5 pb-0" style={{ minHeight: '56px' }}>
                      {online ? (
                        <>
                          <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[13px] font-medium bg-green-50 text-green-700 border border-green-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />在线
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              {device.productType}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-sky-50 text-sky-600 border border-sky-100">
                              {device.positionType}
                            </span>
                          </div>
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium bg-slate-50 text-slate-400 border border-slate-100">
                              {device.productType}
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

                    {/* ── 4. 设备信息区（紧凑标签） ── */}
                    <div className="px-4 pt-2.5 pb-3 flex-1">
                      <div className="flex flex-wrap gap-1.5 items-start content-start overflow-hidden"
                        style={{ minHeight: '62px', maxHeight: '62px' }}>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[13px] font-medium
                          bg-blue-50 text-[#2563EB] border border-blue-100 whitespace-nowrap leading-none">
                          <span className="text-slate-500 mr-0.5">项目:</span>
                          <span className="font-semibold ml-0.5">{device.project}</span>
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[13px] font-medium
                          bg-blue-50 text-[#2563EB] border border-blue-100 whitespace-nowrap leading-none">
                          <span className="text-slate-500 mr-0.5">经度:</span>
                          <span className="font-semibold ml-0.5">{device.longitude}</span>
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[13px] font-medium
                          bg-blue-50 text-[#2563EB] border border-blue-100 whitespace-nowrap leading-none">
                          <span className="text-slate-500 mr-0.5">纬度:</span>
                          <span className="font-semibold ml-0.5">{device.latitude}</span>
                        </span>
                        {device.hasAlert && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[13px] font-bold
                            bg-red-50 text-red-600 border border-red-100 whitespace-nowrap leading-none">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            设备告警
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ── 5. 底部操作栏 ── */}
                    <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors">配置</button>
                        <span className="text-slate-200 text-xs">|</span>
                        <button className="text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors">详情</button>
                        <span className="text-slate-200 text-xs">|</span>
                        <div className="relative">
                          <button
                            onClick={() => setShowMoreMenu(showMoreMenu === device.id ? null : device.id)}
                            className="text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-0.5"
                          >
                            更多<ChevronDown className="w-3 h-3" />
                          </button>
                          {showMoreMenu === device.id && (
                            <div className="absolute left-0 bottom-full mb-1 w-28 bg-white border border-slate-200 rounded shadow-lg z-10">
                              <button className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">修改</button>
                              <button className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-slate-50">删除</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <button className={`flex items-center gap-1 text-[13px] font-medium transition-colors
                        ${offline ? 'text-slate-300 cursor-default' : 'text-[#3B82F6] hover:text-blue-700'}`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                        查看数据
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-white h-12 sticky top-0 z-10">
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
                      设备类型
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
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">接入协议</th>
                  <th className="px-6 text-left text-sm font-semibold text-slate-700">推送协议</th>
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
                      <ProtocolTag value={device.accessProtocol} />
                    </td>
                    <td className="px-6">
                      <ProtocolTag value={device.pushProtocol} />
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
                          查看数据
                        </button>
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
                          配置
                        </button>
                        <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">
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
        <div className="flex-shrink-0 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
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
