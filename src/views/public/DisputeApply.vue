<script setup>
import { ref } from 'vue'

const form = ref({
  desc: '',
  contact: '',
})
const submitted = ref(false)
const caseNo = ref('')

function submit() {
  submitted.value = true
  caseNo.value = `SL-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

function reset() {
  submitted.value = false
  form.value = { desc: '', contact: '' }
}
</script>

<template>
  <div>
    <h1 class="page-title">纠纷一键申请</h1>
    <p class="page-desc">
      支持文字描述；语音、图片等在完整系统中对接上传服务。提交后自动匹配属地群英队伍。
    </p>

    <div v-if="!submitted" class="card">
      <p class="loc">
        <span class="tag tag-public">属地</span>
        当前定位辖区：<strong>幸福社区 · 第一网格</strong>
      </p>
      <div class="form-row">
        <label for="d-desc">纠纷情况描述</label>
        <textarea id="d-desc" v-model="form.desc" placeholder="请简要说明事情经过与诉求" />
      </div>
      <div class="form-row">
        <label for="d-contact">联系方式</label>
        <input id="d-contact" v-model="form.contact" type="tel" inputmode="tel" placeholder="手机号，便于调解员联系" />
      </div>
      <div class="form-row">
        <label>凭证上传</label>
        <button type="button" class="btn btn-outline" disabled>选择图片</button>
      </div>
      <button type="button" class="btn btn-primary" @click="submit">提交申请</button>
    </div>

    <div v-else class="card success">
      <h2 class="ok">申请已提交</h2>
      <p>您的专属编号：<strong class="no">{{ caseNo }}</strong></p>
      <p class="muted">可在「个人纠纷中心」查询受理进度与承办群英信息。</p>
      <button type="button" class="btn btn-outline" @click="reset">再填一单</button>
    </div>
  </div>
</template>

<style scoped>
.loc {
  margin-top: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.muted {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin: 0.25rem 0 0.75rem;
}

.success .ok {
  color: var(--color-primary);
  margin-top: 0;
}

.no {
  font-size: 1.25rem;
  letter-spacing: 0.05em;
}
</style>
