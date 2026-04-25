<script setup>
import { ref } from 'vue'

const linked = ref(false)

function mockLink() {
  linked.value = true
}

function mockConfirm() {
  alert('已生成司法确认申请草稿。')
}
</script>

<template>
  <div>
    <h1 class="page-title">司法数据联动</h1>
    <p class="page-desc">与司法所、法院驻点工作室数据互通；调解协议一键发起司法确认。</p>

    <div class="card">
      <h2 class="h2">平台对接状态</h2>
      <p v-if="!linked">未连接司法系统。</p>
      <p v-else class="ok">已建立数据通道。</p>
      <button type="button" class="btn btn-outline" @click="mockLink">完成对接配置</button>
    </div>

    <div class="card">
      <h2 class="h2">司法确认绿色通道</h2>
      <p class="muted">在双方达成协议并签字后，可在此发起线上司法确认申请，缩短办理时间。</p>
      <button type="button" class="btn btn-primary" @click="mockConfirm">一键发起司法确认</button>
    </div>
  </div>
</template>

<style scoped>
.h2 {
  margin-top: 0;
  font-size: 1.05rem;
}

.ok {
  color: var(--color-primary);
  font-weight: 600;
}

.muted {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}
</style>
