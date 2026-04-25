<script setup>
import { ref } from 'vue'
import { callAI } from '@/services/aiService.js'

const input = ref('请用不超过80字概括“线上调解的关键流程”，并提醒AI不替代群英决策。')
const output = ref('')
const loading = ref(false)
const error = ref('')

async function run() {
  output.value = ''
  error.value = ''
  loading.value = true
  try {
    output.value = await callAI(input.value, {
      temperature: 0.3,
      maxTokens: 512,
      timeoutMs: 30000,
    })
  } catch (e) {
    error.value = e?.message || String(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="ai-chat">
    <h2 class="ai-title">AI 快速测试</h2>

    <div class="card">
      <div class="form-row">
        <label for="prompt">提问</label>
        <textarea
          id="prompt"
          v-model="input"
          placeholder="输入要让AI做的事情（只作辅助，不做裁决）"
        />
      </div>

      <div class="actions">
        <button class="btn btn-primary" type="button" :disabled="loading" @click="run">
          {{ loading ? '请求中...' : '请求AI' }}
        </button>
        <button class="btn btn-outline" type="button" :disabled="loading" @click="input = ''">
          清空
        </button>
      </div>

      <div v-if="error" class="error">
        <strong>错误：</strong>
        <span>{{ error }}</span>
      </div>

      <div v-if="output" class="result">
        <strong>回复：</strong>
        <p>{{ output }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ai-chat {
  text-align: left;
  margin-top: 1rem;
}

.ai-title {
  margin: 0 0 0.4rem;
  color: var(--color-primary);
  font-size: 1.15rem;
}

.ai-desc {
  margin: 0 0 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.error {
  margin-top: 0.85rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #f6c3c3;
  background: #fff5f5;
  color: #b33a3a;
  font-size: 0.95rem;
}

.result {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: #fbfffd;
}

.result p {
  margin: 0.4rem 0 0;
  white-space: pre-wrap;
  color: var(--color-text);
}
</style>

