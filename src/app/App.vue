<template>
  <div class="size-full flex bg-[#F3F4F6]">
    <Sidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <Header />

      <main class="flex-1 overflow-auto px-8 py-6">
        <div class="grid grid-cols-4 gap-6 mb-6">
          <StatCard
            title="项目总数"
            :value="68"
          />
          <StatCard
            title="接入设备总数"
            value="9,393"
          />
          <StatCard
            title="今日新增告警"
            :value="127"
            variant="danger"
            :trend="{ value: 12, isPositive: true }"
            :showTrendBadge="true"
          />
          <StatCard
            title="离线设备数"
            :value="383"
            variant="warning"
            :trend="{ value: 8, isPositive: true }"
            :showTrendBadge="true"
          />
        </div>

        <div class="grid grid-cols-10 gap-6 mb-6">
          <div class="col-span-7 h-[400px]">
            <ProjectTable />
          </div>
          <div class="col-span-3 h-[400px]">
            <AlertList />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 pb-6">
          <div class="min-h-[400px]">
            <AlertFrequencyChart />
          </div>
          <div class="min-h-[400px]">
            <DataTrendChart />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import StatCard from './components/StatCard.vue'
import ProjectTable from './components/ProjectTable.vue'
import AlertList from './components/AlertList.vue'
import AlertFrequencyChart from './components/AlertFrequencyChart.vue'
import DataTrendChart from './components/DataTrendChart.vue'
</script>
