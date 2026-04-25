<script setup>
import { myCases } from '@/data/mock.js'
</script>

<template>
  <div>
    <h1 class="page-title">个人纠纷中心</h1>
    <p class="page-desc">查看本人案件进度、通知提醒；支持线上视频调解入口。</p>

    <div class="card" v-for="c in myCases" :key="c.id">
      <div class="row">
        <span class="id">{{ c.id }}</span>
        <span class="status">{{ c.status }}</span>
      </div>
      <h2 class="title">{{ c.title }}</h2>
      <p class="next"><strong>下一步：</strong>{{ c.nextStep }}</p>
      <div class="actions">
        <button type="button" class="btn btn-primary">进入视频调解</button>
        <button type="button" class="btn btn-outline">查看调解协议</button>
      </div>
    </div>

    <div class="card muted-card">
      <p>调解完成后可在此进行<strong>满意度评价</strong>。正式系统对接消息推送与日历提醒。</p>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.id {
  font-family: ui-monospace, monospace;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.status {
  background: #e8f0ee;
  color: var(--color-primary);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
}

.title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.next {
  margin: 0 0 1rem;
  font-size: 0.95rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.muted-card {
  background: #fafafa;
}

.muted-card p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
