<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
    <div class="px-6 py-4 border-b border-slate-200 flex-shrink-0">
      <h3 class="text-lg font-semibold">各项目告警频次排行</h3>
    </div>

    <div class="px-6 pb-6 pt-4 flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart :data="data" layout="vertical" :margin="{ top: 5, right: 20, left: 10, bottom: 5 }">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" :horizontal="true" :vertical="false" />
          <XAxis
            type="number"
            :tick="{ fontSize: 13, fill: '#64748b' }"
          />
          <YAxis
            type="category"
            dataKey="name"
            :tick="{ fontSize: 13, fill: '#64748b' }"
            :width="130"
          />
          <Tooltip
            :contentStyle="{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '14px',
              padding: '12px'
            }"
            :formatter="(value) => [`${value} 次`, '告警次数']"
          />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            :radius="[0, 6, 6, 0]"
            name="告警次数"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = ref([
  { name: '金堂水厂流量监测', count: 187 },
  { name: '渠县闸门项目', count: 156 },
  { name: '威远河口灌区', count: 142 },
  { name: '空港水厂取水', count: 98 },
  { name: '都江堰轨道交通', count: 76 },
  { name: '唐源电气2026', count: 54 },
  { name: '观测场', count: 32 },
  { name: '德阳文庙项目', count: 18 },
])
</script>
