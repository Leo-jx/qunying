<script setup>
import { ref } from 'vue'
import { qunyingInbox } from '@/data/mock.js'
import { generateSummary } from '@/services/aiService.js'

const items = ref([...qunyingInbox])
const accepted = ref(false)
const loadingId = ref('')

function accept() {
  accepted.value = true
}

async function generateFor(item) {
  loadingId.value = item.id
  try {
    item.aiHint = await generateSummary(item.summary, 160)
  } catch (e) {
    item.aiHint = item.aiHint || 'AI生成失败：请检查后端代理与密钥配置'
    console.error('[Inbox] AI generate failed:', e)
  } finally {
    loadingId.value = ''
  }
}
</script>

<template>
  <div>
    <h1 class="page-title">纠纷承接与分派</h1>
    <p class="page-desc">查看申请详情与凭证；复杂纠纷可发起联合调解。</p>

    <div v-for="item in items" :key="item.id" class="card">
      <div class="head">
        <span class="id">{{ item.id }}</span>
        <span class="date">提交 {{ item.submittedAt }}</span>
      </div>
      <p class="summary">{{ item.summary }}</p>
      <div class="ai-box">
        <p>{{ item.aiHint }}</p>
        <small v-if="loadingId === item.id" class="muted">AI生成中...</small>
        <small v-else class="muted">点击“AI 生成争点摘要”可刷新（演示）。</small>
      </div>
      <div class="actions" v-if="!accepted">
        <button type="button" class="btn btn-primary" @click="accept">确认承接</button>
        <button type="button" class="btn btn-outline">转派 / 联合调解</button>
      </div>
      <div class="actions" v-else>
        <button
          type="button"
          class="btn btn-outline"
          @click="generateFor(item)"
          :disabled="loadingId === item.id"
        >
          AI 生成争点摘要
        </button>
      </div>
      <p v-if="accepted" class="done">已承接，请前往「调解工作台」记录过程。</p>
    </div>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}

.id {
  font-weight: 700;
  color: var(--color-primary);
}

.date {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.summary {
  margin: 0 0 1rem;
  font-size: 1.02rem;
}

.ai-box {
  background: #f4faf7;
  padding: 0.85rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.ai-box p {
  margin: 0.5rem 0 0.35rem;
  font-size: 0.95rem;
}

.ai-box small {
  color: var(--color-text-muted);
}

.muted {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.done {
  margin: 0;
  color: var(--color-primary);
  font-weight: 600;
}
</style>
