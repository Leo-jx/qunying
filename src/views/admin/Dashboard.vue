<script setup>
const rows = [
  { id: 'SL-2026-0102', type: '邻里', stage: '调解中', days: 5, owner: '张**' },
  { id: 'SL-2026-0095', type: '家庭', stage: '超期预警', days: 18, owner: '李**' },
  { id: 'SL-2026-0091', type: '物业', stage: '已办结', days: 12, owner: '王**' },
]
</script>

<template>
  <div>
    <h1 class="page-title">纠纷统筹监管</h1>
    <p class="page-desc">辖区全量纠纷进度、督办超期、统筹调配群英资源。</p>

    <div class="card">
      <div class="kpis">
        <div class="kpi">
          <span class="num">12</span>
          <span class="lbl">在办</span>
        </div>
        <div class="kpi warn">
          <span class="num">2</span>
          <span class="lbl">待督办</span>
        </div>
        <div class="kpi">
          <span class="num">114</span>
          <span class="lbl">本年累计办结</span>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="h2">案件列表</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>类型</th>
              <th>阶段</th>
              <th>历时(天)</th>
              <th>承办</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.id" :class="{ warn: r.stage === '超期预警' }">
              <td>{{ r.id }}</td>
              <td>{{ r.type }}</td>
              <td>{{ r.stage }}</td>
              <td>{{ r.days }}</td>
              <td>{{ r.owner }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpis {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.kpi {
  flex: 1;
  min-width: 120px;
  padding: 1rem;
  background: #f0f7f4;
  border-radius: 8px;
  text-align: center;
}

.kpi.warn {
  background: #fff5f0;
}

.num {
  display: block;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-primary);
}

.kpi.warn .num {
  color: var(--color-danger);
}

.lbl {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

th,
td {
  padding: 0.65rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  background: #f4f6f3;
  font-weight: 700;
}

tr.warn td {
  color: var(--color-danger);
  font-weight: 600;
}
</style>
