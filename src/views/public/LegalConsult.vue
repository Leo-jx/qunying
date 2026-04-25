<script setup>
import { ref } from 'vue'
import { aiLegalConsult } from '@/services/aiService.js'

const question = ref('')
const answer = ref('')
const aiLoading = ref(false)
const aiError = ref('')

function ask() {
  if (!question.value.trim()) {
    answer.value = '请先输入您要咨询的问题。'
    return
  }
  answer.value =
    '您的问题已记录。我们将由在线法律顾问或智能客服在合规范围内作答，复杂问题建议预约线下咨询。您也可在群英调解过程中申请法治指导。'
}

async function askWithAI() {
  aiLoading.value = true
  aiError.value = ''
  answer.value = ''
  try {
    answer.value = await aiLegalConsult(question.value)
  } catch (e) {
    aiError.value = e?.message || String(e)
    answer.value = 'AI答疑失败（演示）。你仍可以走“记录咨询”流程，正式接入后会自动启用AI回复。'
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="page-title">法治咨询入口</h1>
    <p class="page-desc">对接法律顾问与普法内容。</p>

    <div class="card">
      <div class="form-row">
        <label for="q">咨询内容</label>
        <textarea id="q" v-model="question" placeholder="例如：邻里漏水责任怎么划分？" />
      </div>
      <div class="actions">
        <button type="button" class="btn btn-outline" @click="ask" :disabled="aiLoading">
          记录咨询（不调用AI）
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="askWithAI"
          :disabled="aiLoading || !question.trim()"
        >
          {{ aiLoading ? 'AI处理中...' : 'AI 辅助答疑（演示）' }}
        </button>
      </div>
    </div>

    <div v-if="answer" class="card reply">
      <h2 class="reply-h">回复</h2>
      <p>{{ answer }}</p>
    </div>

    <div class="card links">
      <h2 class="reply-h">常用指引</h2>
      <ul>
        <li>人民调解的申请与效力</li>
        <li>司法确认的条件与流程</li>
        <li>个人信息保护与调解保密</li>
      </ul>
    </div>

    <div v-if="aiError" class="card error">
      <strong>AI错误：</strong>
      <span>{{ aiError }}</span>
    </div>
  </div>
</template>

<style scoped>
.reply-h {
  margin-top: 0;
  font-size: 1rem;
  color: var(--color-primary);
}

.reply p {
  margin: 0;
  line-height: 1.6;
}

.links ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.65rem;
}

.error {
  margin-top: 0.85rem;
  border: 1px solid #f6c3c3;
  background: #fff5f5;
  color: #b33a3a;
  font-size: 0.95rem;
  white-space: pre-wrap;
}
</style>
