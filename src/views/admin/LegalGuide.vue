<script setup>
import { ref } from 'vue'

const note = ref('')

function send() {
  alert('指导意见将推送至该案群英工作台。')
  note.value = ''
}
</script>

<template>
  <div>
    <h1 class="page-title">法治协同指导</h1>
    <p class="page-desc">法律顾问、司法人员在线纠偏、会商疑难案件，保障调解合法合规。</p>

    <div class="card">
      <h2 class="h2">待指导事项（示例）</h2>
      <ul class="cases">
        <li>
          <strong>SL-2026-0102</strong> — 相邻漏水责任与鉴定程序咨询
          <span class="tag">待回复</span>
        </li>
        <li>
          <strong>SL-2026-0088</strong> — 协议条款与强制性规定冲突复核
          <span class="tag done">已指导</span>
        </li>
      </ul>
    </div>

    <div class="card">
      <h2 class="h2">撰写指导意见</h2>
      <div class="form-row">
        <label for="n">内容</label>
        <textarea id="n" v-model="note" placeholder="法律适用建议、风险提示、程序提醒……" />
      </div>
      <button type="button" class="btn btn-primary" @click="send">发送给承办群英</button>
    </div>
  </div>
</template>

<style scoped>
.h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

.cases {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cases li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: #fff3e0;
  color: #b35900;
}

.tag.done {
  background: #e8f5e9;
  color: #2e7d32;
}
</style>
