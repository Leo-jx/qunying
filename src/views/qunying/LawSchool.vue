<script setup>
import { courses } from '@/data/mock.js'
</script>

<template>
  <div>
    <h1 class="page-title">群英法律充电站</h1>
    <p class="page-desc">法治培训课程、法条解读与调解技巧，线上线下结合学习。</p>

    <div class="card">
      <ul class="list">
        <li v-for="(c, i) in courses" :key="i" class="list-item">
          <div>
            <strong>{{ c.title }}</strong>
            <span class="meta">{{ c.type }} · {{ c.duration }}</span>
          </div>
          <button type="button" class="btn btn-primary">学习</button>
        </li>
      </ul>
    </div>

    <div class="card more">
      <p>正式环境可接入直播、考试学分、学习档案；内容随法规更新同步维护。</p>
    </div>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.meta {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.more p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
