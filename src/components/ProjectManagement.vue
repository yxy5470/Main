<template>
  <div class="size-full bg-[#F3F4F6] overflow-auto px-8 py-6">
    <!-- 顶部搜索与筛选卡片 -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
      <div class="flex items-end gap-6">
        <div class="flex-1 flex items-end gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-slate-700 mb-2">项目名称</label>
            <input
              v-model="searchName"
              type="text"
              placeholder="请输入项目名称"
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="w-48">
            <label class="block text-sm font-medium text-slate-700 mb-2">状态</label>
            <select
              v-model="searchStatus"
              class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部</option>
              <option value="normal">正常</option>
              <option value="inactive">停用</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="handleSearch"
            class="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Search :size="18" />
            <span>搜索</span>
          </button>

          <button
            @click="handleReset"
            class="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 树形数据表格卡片 -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-white">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">项目名称</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">项目描述</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">排序</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">状态</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">负责人</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">联系电话</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">创建时间</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="company in companies" :key="company.id">
              <!-- 父级行 -->
              <tr
                class="border-b border-slate-200 hover:bg-blue-50/50 transition-colors cursor-pointer"
                @click="toggleExpand(company.id)"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <ChevronDown
                      v-if="company.expanded"
                      :size="20"
                      class="text-slate-600 flex-shrink-0"
                    />
                    <ChevronRight
                      v-else
                      :size="20"
                      class="text-slate-600 flex-shrink-0"
                    />
                    <span class="text-sm font-semibold text-slate-900">{{ company.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-500">-</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-900">{{ company.sort }}</span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                      company.status === 'normal'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    ]"
                  >
                    {{ company.status === 'normal' ? '正常' : '停用' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-900">{{ company.manager }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-900">{{ company.phone }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-slate-600">{{ company.createdAt }}</span>
                </td>
                <td class="px-6 py-4">
                  <button
                    class="inline-flex items-center gap-1.5 text-sm text-[#3B82F6] hover:text-blue-600 font-medium"
                    @click.stop="viewProducts(company)"
                  >
                    <Eye :size="16" />
                    <span>查看产品</span>
                  </button>
                </td>
              </tr>

              <!-- 子级行 -->
              <template v-if="company.expanded">
                <tr
                  v-for="project in company.projects"
                  :key="project.id"
                  class="border-b border-slate-200 hover:bg-blue-50/50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <div class="flex items-start gap-2 pl-8">
                      <div class="flex flex-col items-center pt-1">
                        <div class="w-px h-2 bg-slate-300"></div>
                        <div class="w-3 h-px bg-slate-300"></div>
                      </div>
                      <div class="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                      <span class="text-sm text-slate-900">{{ project.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-slate-600">{{ project.description || '-' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-slate-900">{{ project.sort }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                        project.status === 'normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      ]"
                    >
                      {{ project.status === 'normal' ? '正常' : '停用' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-slate-900">{{ project.manager }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-slate-900">{{ project.phone }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-sm text-slate-600">{{ project.createdAt }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <button
                      class="inline-flex items-center gap-1.5 text-sm text-[#3B82F6] hover:text-blue-600 font-medium"
                      @click="viewProducts(project)"
                    >
                      <Eye :size="16" />
                      <span>查看产品</span>
                    </button>
                  </td>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, ChevronDown, ChevronRight, Eye } from 'lucide-vue-next'

const searchName = ref('')
const searchStatus = ref('')

const companies = ref([
  {
    id: 1,
    name: '测艺科技',
    sort: 1,
    status: 'normal',
    manager: '张明',
    phone: '138-8888-8888',
    createdAt: '2024-01-15',
    expanded: true,
    projects: [
      {
        id: 11,
        name: '测试项目',
        description: '用于系统功能测试的示范项目',
        sort: 1,
        status: 'normal',
        manager: '李华',
        phone: '139-7777-7777',
        createdAt: '2024-02-20',
      },
      {
        id: 12,
        name: '观测场监控系统',
        description: '气象数据实时采集与监控',
        sort: 2,
        status: 'normal',
        manager: '王芳',
        phone: '137-6666-6666',
        createdAt: '2024-03-10',
      },
    ],
  },
  {
    id: 2,
    name: '四川水利工程集团',
    sort: 2,
    status: 'normal',
    manager: '刘强',
    phone: '136-5555-5555',
    createdAt: '2023-11-20',
    expanded: false,
    projects: [
      {
        id: 21,
        name: '空港水厂取水监测项目',
        description: '水质监测与流量控制系统',
        sort: 1,
        status: 'normal',
        manager: '陈伟',
        phone: '135-4444-4444',
        createdAt: '2024-01-08',
      },
      {
        id: 22,
        name: '金堂水厂流量监测项目',
        description: '',
        sort: 2,
        status: 'normal',
        manager: '赵敏',
        phone: '134-3333-3333',
        createdAt: '2024-02-15',
      },
      {
        id: 23,
        name: '威远河口灌区项目',
        description: '灌区智能化管理平台',
        sort: 3,
        status: 'normal',
        manager: '孙丽',
        phone: '133-2222-2222',
        createdAt: '2024-03-22',
      },
    ],
  },
  {
    id: 3,
    name: '德阳文化旅游发展有限公司',
    sort: 3,
    status: 'normal',
    manager: '周杰',
    phone: '132-1111-1111',
    createdAt: '2024-02-01',
    expanded: false,
    projects: [
      {
        id: 31,
        name: '德阳文庙项目',
        description: '文物保护环境监测系统',
        sort: 1,
        status: 'normal',
        manager: '吴雪',
        phone: '131-9999-9999',
        createdAt: '2024-02-28',
      },
    ],
  },
  {
    id: 4,
    name: '渠县水务局',
    sort: 4,
    status: 'inactive',
    manager: '郑涛',
    phone: '130-8888-8888',
    createdAt: '2023-12-10',
    expanded: false,
    projects: [
      {
        id: 41,
        name: '渠县闸门项目',
        description: '',
        sort: 1,
        status: 'inactive',
        manager: '钱磊',
        phone: '139-0000-0000',
        createdAt: '2024-01-20',
      },
    ],
  },
  {
    id: 5,
    name: '都江堰轨道交通有限公司',
    sort: 5,
    status: 'normal',
    manager: '冯娟',
    phone: '138-1111-1111',
    createdAt: '2024-03-01',
    expanded: false,
    projects: [
      {
        id: 51,
        name: '都江堰轨道交通项目',
        description: '轨道沿线环境监测系统',
        sort: 1,
        status: 'normal',
        manager: '曹阳',
        phone: '137-2222-2222',
        createdAt: '2024-03-15',
      },
    ],
  },
])

const toggleExpand = (id) => {
  const company = companies.value.find((c) => c.id === id)
  if (company) {
    company.expanded = !company.expanded
  }
}

const handleSearch = () => {
  console.log('搜索:', { name: searchName.value, status: searchStatus.value })
}

const handleReset = () => {
  searchName.value = ''
  searchStatus.value = ''
}

const viewProducts = (item) => {
  console.log('查看产品:', item)
}
</script>
