<script setup>
import { ref, computed } from 'vue'
import { lawArticles, templates } from '@/data/mock.js'
import { legalReferenceSuggestions } from '@/services/aiService.js'

const keyword = ref('')
const caseText = ref('')
const aiLoading = ref(false)
const aiResult = ref('')
const aiError = ref('')

const filtered = computed(() => {
  const k = keyword.value.trim()
  if (!k) return lawArticles
  return lawArticles.filter(
    (a) => a.title.includes(k) || a.snippet.includes(k),
  )
})

async function runAiReference() {
  aiLoading.value = true
  aiResult.value = ''
  aiError.value = ''
  try {
    aiResult.value = await legalReferenceSuggestions(
      caseText.value || '没有填写案情/争点描述',
    )
  } catch (e) {
    aiError.value = e?.message || String(e)
    aiResult.value = ''
  } finally {
    aiLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="page-title">法治智能辅助库</h1>
    <p class="page-desc">法条、案例、协议模板一键查阅。</p>

    <div class="card">
      <div class="form-row">
        <label for="kw">检索</label>
        <input id="kw" v-model="keyword" placeholder="输入关键词，如：相邻、物业" />
      </div>
      <ul class="articles">
        <li v-for="a in filtered" :key="a.id">
          <strong>{{ a.title }}</strong>
          <p>{{ a.snippet }}</p>
        </li>
      </ul>
    </div>

    <div class="card">
      <h2 class="h2">AI 法治参考（仅参考）</h2>
      <p class="page-desc small-desc">输入案情/争点描述，AI 输出“法条类别/参考要点/程序提醒”。不做裁决。</p>
      <div class="form-row">
        <label for="case">案情/争点</label>
        <textarea id="case" v-model="caseText" placeholder="例如：邻里漏水争议，维修责任与费用如何协商？" />
      </div>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="aiLoading || !caseText.trim()"
        @click="runAiReference"
      >
        {{ aiLoading ? 'AI处理中...' : '请求 AI 参考' }}
      </button>
      <div v-if="aiError" class="error">
        <strong>AI错误：</strong>
        <span>{{ aiError }}</span>
      </div>
      <div v-if="aiResult" class="ai-result">
        <pre class="pre">{{ aiResult }}</pre>
      </div>
    </div>

    <div class="card">
      <h2 class="h2">调解协议模板</h2>
      <ul class="tpl">
        <li v-for="(t, i) in templates" :key="i">
          {{ t }}
          <button type="button" class="btn btn-outline small">打开套用</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

.articles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.articles li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.articles li:last-child {
  border-bottom: none;
}

.articles p {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: var(--color-text-muted);
}

.tpl {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tpl li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.btn.small {
  min-height: 40px;
  padding: 0.35rem 0.75rem;
  font-size: 0.88rem;
}

.small-desc {
  margin-top: -0.4rem;
  margin-bottom: 1rem;
}

.error {
  margin-top: 0.85rem;
  border: 1px solid #f6c3c3;
  background: #fff5f5;
  color: #b33a3a;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.95rem;
  white-space: pre-wrap;
}

.ai-result {
  margin-top: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: #fbfffd;
}

.pre {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.55;
}

.tip {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.5rem;
}
</style>
