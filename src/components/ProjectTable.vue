<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
    <div class="px-6 py-4 border-b border-slate-200 flex-shrink-0">
      <h3 class="text-lg font-semibold">项目实时监控</h3>
    </div>

    <div class="overflow-y-scroll flex-1">
      <table class="w-full">
        <thead class="sticky top-0 bg-slate-50 z-10">
          <tr class="border-b border-slate-200">
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              项目名称
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              总设备数
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              离线数
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              在线率
            </th>
            <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              状态
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr
            v-for="(project, index) in projects"
            :key="project.id"
            :class="[
              'hover:bg-slate-50 transition-colors',
              index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
            ]"
          >
            <td class="px-6 py-4 text-sm font-medium text-foreground">
              {{ project.name }}
            </td>
            <td class="px-6 py-4 text-sm text-foreground">
              {{ project.totalDevices.toLocaleString() }}
            </td>
            <td class="px-6 py-4 text-sm">
              <span :class="project.offlineDevices > 0 ? 'text-red-600 font-semibold' : 'text-muted-foreground'">
                {{ project.offlineDevices }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-foreground w-12">
                  {{ project.onlineRate }}%
                </span>
                <div class="flex-1 max-w-[120px]">
                  <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      :class="[
                        'h-full rounded-full',
                        project.onlineRate >= 98 ? 'bg-green-500' :
                        project.onlineRate >= 90 ? 'bg-yellow-500' :
                        'bg-red-500'
                      ]"
                      :style="{ width: `${project.onlineRate}%` }"
                    />
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  project.status === 'normal'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ project.status === 'normal' ? '正常' : '异常' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projects = ref([
  { id: 1, name: '观测场', totalDevices: 1245, offlineDevices: 0, onlineRate: 100, status: 'normal' },
  { id: 2, name: '空港水厂取水监测项目', totalDevices: 876, offlineDevices: 23, onlineRate: 97.4, status: 'normal' },
  { id: 3, name: '金堂水厂流量监测项目', totalDevices: 654, offlineDevices: 87, onlineRate: 86.7, status: 'alert' },
  { id: 4, name: '德阳文庙项目', totalDevices: 432, offlineDevices: 0, onlineRate: 100, status: 'normal' },
  { id: 5, name: '渠县闸门项目', totalDevices: 567, offlineDevices: 45, onlineRate: 92.1, status: 'alert' },
  { id: 6, name: '酉酬项目', totalDevices: 324, offlineDevices: 0, onlineRate: 100, status: 'normal' },
  { id: 7, name: '都江堰轨道交通项目', totalDevices: 1876, offlineDevices: 12, onlineRate: 99.4, status: 'normal' },
  { id: 8, name: '威远河口灌区项目', totalDevices: 987, offlineDevices: 67, onlineRate: 93.2, status: 'alert' },
  { id: 9, name: '唐源电气2026项目', totalDevices: 1432, offlineDevices: 8, onlineRate: 99.4, status: 'normal' },
])
</script>
