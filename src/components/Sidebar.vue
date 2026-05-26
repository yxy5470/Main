<template>
  <aside class="w-64 bg-[#1E293B] flex flex-col h-full">
    <div class="px-6 py-5 border-b border-slate-700">
      <h2 class="text-xl font-semibold text-white">物联网监测管理平台</h2>
    </div>

    <nav class="flex-1 px-4 py-4">
      <div class="space-y-1">
        <a
          href="#"
          @click.prevent="$emit('navigate', 'home')"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            currentPage === 'home'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          ]"
        >
          <Home :size="20" />
          <span class="text-base">首页</span>
        </a>

        <a
          href="#"
          @click.prevent="$emit('navigate', 'projects')"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            currentPage === 'projects'
              ? 'bg-blue-600 text-white'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
          ]"
        >
          <FolderOpen :size="20" />
          <span class="text-base">项目管理</span>
        </a>

        <a
          href="#"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Layers :size="20" />
          <span class="text-base">设备监控</span>
        </a>

        <a
          href="#"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Activity :size="20" />
          <span class="text-base">数据分析</span>
        </a>

        <a
          href="#"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Bell :size="20" />
          <span class="text-base">告警中心</span>
        </a>

        <a
          href="#"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <Settings :size="20" />
          <span class="text-base">系统设置</span>
        </a>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { Home, Layers, Activity, Settings, Bell, FolderOpen } from 'lucide-vue-next'

defineProps({
  currentPage: {
    type: String,
    default: 'home'
  }
})

defineEmits(['navigate'])
</script>
