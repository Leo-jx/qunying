<script setup>
import { ref } from 'vue'
import { callAI } from '@/services/aiService.js'

const manualLog = ref('')
const draftFromAi = ref('')
const showAiDraft = ref(false)
const speechInput = ref('申请人：希望对方尽快维修。被申请人：愿意修，但对费用有异议。调解员：建议先共同委托第三方勘验。')
const aiLoading = ref(false)
const aiError = ref('')

async function simulateTranscribe() {
  aiLoading.value = true
  aiError.value = ''
  showAiDraft.value = true
  try {
    const prompt = `请将下面的调解现场口述转写为“笔录草稿”。要求：1) 只改写口述内容，不补充未提及的信息；2) 明确标注为草稿，需群英人工核对；3) 不要给出裁决结论。\n\n口述内容：${speechInput.value}`
    draftFromAi.value = await callAI(prompt, { temperature: 0.2, maxTokens: 512, timeoutMs: 30000 })
  } catch (e) {
    aiError.value = e?.message || String(e)
  } finally {
    aiLoading.value = false
  }
}

function useDraft() {
  manualLog.value = draftFromAi.value + '\n\n' + (manualLog.value || '')
}
</script>

<template>
  <div>
    <h1 class="page-title">线上线下调解工作台</h1>

    <div class="card">
      <h2 class="h2">本场调解</h2>
      <div class="toolbar">
        <button type="button" class="btn btn-outline">发起线下签到</button>
        <button type="button" class="btn btn-outline">发起视频调解</button>
      </div>
    </div>

    <div class="card">
      <h2 class="h2">调解过程记录</h2>
      <div class="form-row">
        <label for="log">笔录与协商要点（群英定稿）</label>
        <textarea id="log" v-model="manualLog" placeholder="双方陈述、争议焦点、协商过程……" />
      </div>
      <div class="form-row">
        <label for="speech">语音内容（演示：可直接输入/粘贴）</label>
        <textarea id="speech" v-model="speechInput" placeholder="请输入现场口述内容……" />
      </div>
      <div class="ai-row">
        <button type="button" class="btn btn-primary" :disabled="aiLoading" @click="simulateTranscribe">
          {{ aiLoading ? '生成中...' : '语音转文字草稿' }}
        </button>
      </div>
      <div v-if="showAiDraft" class="draft">
        <p>{{ draftFromAi }}</p>
        <div v-if="aiError" class="error">
          <strong>AI错误：</strong>
          <span>{{ aiError }}</span>
        </div>
        <button type="button" class="btn btn-outline" @click="useDraft">插入到编辑区（可再改）</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.h2 {
  margin-top: 0;
  font-size: 1.05rem;
  color: var(--color-primary);
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ai-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.hint {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.draft {
  background: #fffbf0;
  border: 1px dashed var(--color-accent);
  padding: 0.85rem;
  border-radius: 8px;
}

.draft p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.error {
  margin-top: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #f6c3c3;
  background: #fff5f5;
  color: #b33a3a;
  font-size: 0.92rem;
  white-space: pre-wrap;
}
</style>
