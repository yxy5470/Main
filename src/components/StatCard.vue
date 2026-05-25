<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
    <div class="text-sm text-muted-foreground mb-3">{{ title }}</div>
    <div :class="['text-3xl font-semibold mb-2', valueColor]">
      {{ value }}
    </div>
    <div
      v-if="trend && showTrendBadge"
      :class="[
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
        trend.isPositive ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
      ]"
    >
      <ArrowUp v-if="trend.isPositive" :size="16" />
      <ArrowDown v-else :size="16" />
      <span>{{ trend.isPositive ? '+' : '' }}{{ trend.value }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowUp, ArrowDown } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  trend: {
    type: Object,
    default: null
  },
  variant: {
    type: String,
    default: 'default'
  },
  showTrendBadge: {
    type: Boolean,
    default: false
  }
})

const valueColor = computed(() => {
  if (props.variant === 'danger') return 'text-red-600'
  if (props.variant === 'warning') return 'text-orange-500'
  return 'text-foreground'
})
</script>
