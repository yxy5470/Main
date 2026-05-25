<template>
  <header class="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
    <div class="flex items-center gap-2">
      <span class="text-muted-foreground">首页</span>
    </div>

    <div class="relative">
      <button
        @click="showDropdown = !showDropdown"
        class="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-medium">
          吴
        </div>
        <span class="font-medium text-foreground">吴嘉乐</span>
        <ChevronDown :size="16" class="text-muted-foreground" />
      </button>

      <div v-if="showDropdown" class="absolute right-0 top-full mt-3 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
        <button class="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3">
          <span class="text-xl">🖥️</span>
          <span class="text-base">回到大屏</span>
        </button>
        <button class="w-full px-5 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 text-red-600">
          <span class="text-xl">🚪</span>
          <span class="text-base">退出登录</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const showDropdown = ref(true)
</script>
