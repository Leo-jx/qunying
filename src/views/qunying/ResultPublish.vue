<script setup>
import { ref } from 'vue'
import { complianceCheckForPublic, redactForPublic } from '@/services/aiService.js'

const conclusion = ref('')
const desensitized = ref('')
const checked = ref(false)
const aiChecking = ref(false)
const aiError = ref('')

function runDesensitize() {
  checked.value = true
  const raw = conclusion.value || '双方就维修与补偿达成一致，约定于两周内完成施工。联系人：张某某 138****0000。'
  desensitized.value = raw
    .replace(/1[3-9]\d{9}/g, '1**********')
    .replace(/张[\u4e00-\u9fa5]{1,2}/g, '张**')
}

async function runAiDesensitizeAndCheck() {
  aiChecking.value = true
  aiError.value = ''
  checked.value = false

  try {
    const raw = conclusion.value || '双方就维修与补偿达成一致，约定于两周内完成施工。联系人：张某某 138****0000。'
    const publicText = await redactForPublic(raw)
    desensitized.value = publicText
    checked.value = true

    const compliance = await complianceCheckForPublic(publicText)
    // 合并展示：方便群英一眼看到“脱敏文本 + 风险提示”
    desensitized.value = `${publicText}\n\n${compliance}`
  } catch (e) {
    aiError.value = e?.message || String(e)
    // 兜底：至少给出正则脱敏结果
    runDesensitize()
  } finally {
    aiChecking.value = false
  }
}

function submitPublish() {
  if (!desensitized.value) runDesensitize()
  alert('已提交公示。系统将经合规校验后发布至三公开专区。')
}
</script>

<template>
  <div>
    <h1 class="page-title">结果出具与公示</h1>
    <p class="page-desc">群英自主商定结论并上传签字协议；公示前须脱敏与合规检查。</p>

    <div class="card">
      <div class="form-row">
        <label for="con">调解结论（原文，内部留存）</label>
        <textarea id="con" v-model="conclusion" placeholder="录入调解结论要点……" />
      </div>
      <div class="actions-row">
        <button type="button" class="btn btn-outline" @click="runDesensitize">脱敏预览（规则）</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="aiChecking"
          @click="runAiDesensitizeAndCheck"
        >
          {{ aiChecking ? 'AI处理中...' : 'AI 脱敏与合规检查（演示）' }}
        </button>
      </div>
      <div v-if="aiError" class="error">
        <strong>AI错误：</strong>
        <span>{{ aiError }}</span>
      </div>
      <div v-if="checked" class="preview">
        <h2 class="h2">脱敏公示预览</h2>
        <p>{{ desensitized }}</p>
      </div>
      <div class="actions">
        <button type="button" class="btn btn-primary" @click="submitPublish">提交至三公开</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8faf9;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}

.h2 {
  margin-top: 0;
  font-size: 1rem;
  color: var(--color-primary);
}

.preview p {
  margin: 0.5rem 0;
  line-height: 1.55;
}

.preview small {
  color: var(--color-text-muted);
}

.actions {
  margin-top: 1rem;
}

.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.75rem;
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
