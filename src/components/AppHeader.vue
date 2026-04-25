<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  title: { type: String, default: '' },
  showElderToggle: { type: Boolean, default: true },
})

const elderMode = inject('elderMode')
const route = useRoute()
</script>

<template>
  <header class="app-header">
    <div class="inner">
      <router-link to="/" class="brand" aria-label="返回门户首页">
        <span class="brand-mark">群</span>
        <span class="brand-text">群英断是非</span>
      </router-link>
      <h1 v-if="title" class="header-title">{{ title }}</h1>
      <div class="header-actions">
        <button
          v-if="showElderToggle"
          type="button"
          class="elder-btn"
          :aria-pressed="elderMode"
          @click="elderMode = !elderMode"
        >
          {{ elderMode ? '标准字号' : '大字号' }}
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #1a5f4a 0%, #236b52 100%);
  color: #fff;
  padding: 0.75rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
}

.brand:hover {
  text-decoration: none;
  opacity: 0.92;
}

.brand-mark {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.header-title {
  flex: 1;
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.elder-btn {
  min-height: var(--tap-min, 44px);
  padding: 0 0.85rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.elder-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.hint {
  font-size: 0.8rem;
  opacity: 0.85;
}
</style>
