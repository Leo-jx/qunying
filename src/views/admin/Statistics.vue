<script setup>
import { adminStats } from '@/data/mock.js'

const maxVal = Math.max(...adminStats.byType.map((x) => x.value))
</script>

<template>
  <div>
    <h1 class="page-title">数据统计分析</h1>
    <p class="page-desc">纠纷类型、化解率、满意度与高发点分析，服务基层治理决策。</p>

    <div class="card kpis">
      <div class="item">
        <span class="big">{{ adminStats.total }}</span>
        <span>本年受理（件）</span>
      </div>
      <div class="item">
        <span class="big">{{ adminStats.resolvedRate }}%</span>
        <span>化解率</span>
      </div>
      <div class="item">
        <span class="big">{{ adminStats.satisfaction }}</span>
        <span>群众满意度（5分制）</span>
      </div>
    </div>

    <div class="card">
      <h2 class="h2">纠纷类型分布</h2>
      <div class="bars">
        <div v-for="t in adminStats.byType" :key="t.name" class="bar-row">
          <span class="name">{{ t.name }}</span>
          <div class="bar-bg">
            <div
              class="bar-fill"
              :style="{ width: `${(t.value / maxVal) * 100}%` }"
            />
          </div>
          <span class="val">{{ t.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.item {
  text-align: center;
  padding: 0.75rem;
  background: #f8faf9;
  border-radius: 8px;
}

.item span:not(.big) {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.big {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--color-primary);
}

.h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.bar-row {
  display: grid;
  grid-template-columns: 48px 1fr 36px;
  align-items: center;
  gap: 0.5rem;
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
}

.bar-bg {
  height: 22px;
  background: #e8ece9;
  border-radius: 6px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
  border-radius: 6px;
  min-width: 4px;
}

.val {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
</style>
