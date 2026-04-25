<script setup>
import { publicCases, processNodes, resultsPublic } from '@/data/mock.js'
</script>

<template>
  <div>
    <h1 class="page-title">三公开监督专区</h1>
    <p class="page-desc">受理、过程、结果均脱敏公示，保障群众知情权与监督权。</p>

    <section class="card">
      <h2 class="section-h"><span class="tag tag-public">公开一</span> 纠纷受理公开</h2>
      <ul class="plain">
        <li v-for="c in publicCases" :key="c.id" class="list-item">
          <strong>{{ c.id }}</strong> · {{ c.type }} · 受理 {{ c.acceptedAt }} · 承办 {{ c.mediators }} ·
          <em>{{ c.status }}</em>
        </li>
      </ul>
    </section>

    <section class="card">
      <h2 class="section-h"><span class="tag tag-public">公开二</span> 调解过程公开（示例案件）</h2>
      <p class="case-ref">案件编号 SL-2026-0102</p>
      <ol class="timeline">
        <li v-for="(n, i) in processNodes" :key="i">
          <time>{{ n.time }}</time>
          <span class="node-title">{{ n.title }}</span>
          <span class="node-detail">{{ n.detail }}</span>
        </li>
      </ol>
    </section>

    <section class="card">
      <h2 class="section-h"><span class="tag tag-public">公开三</span> 结果公示公开</h2>
      <ul class="plain">
        <li v-for="r in resultsPublic" :key="r.id" class="list-item">
          <strong>{{ r.id }}</strong> · {{ r.type }} · 办结 {{ r.closedAt }}
          <p class="summary">{{ r.summary }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.section-h {
  margin-top: 0;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.plain {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-ref {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0 0 0.75rem;
}

.timeline {
  margin: 0;
  padding-left: 1.2rem;
}

.timeline li {
  margin-bottom: 0.85rem;
}

.timeline time {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.node-title {
  font-weight: 700;
  color: var(--color-primary);
}

.node-detail {
  display: block;
  margin-top: 0.2rem;
}

.summary {
  margin: 0.35rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
}
</style>
