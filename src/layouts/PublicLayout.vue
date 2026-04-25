<script setup>
import AppHeader from '@/components/AppHeader.vue'

const nav = [
  { to: '/public/apply', label: '纠纷申请' },
  { to: '/public/open', label: '三公开监督' },
  { to: '/public/mine', label: '个人纠纷中心' },
  { to: '/public/legal', label: '法治咨询' },
]
</script>

<template>
  <div class="layout">
    <AppHeader title="群众端" />
    <nav class="subnav" aria-label="群众端导航">
      <router-link v-for="item in nav" :key="item.to" :to="item.to" class="subnav-link">
        {{ item.label }}
      </router-link>
    </nav>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.subnav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.65rem 1rem;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.subnav-link {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  color: var(--color-text);
  font-weight: 600;
  text-decoration: none;
  min-height: var(--tap-min, 44px);
  display: inline-flex;
  align-items: center;
}

.subnav-link:hover {
  background: rgba(26, 95, 74, 0.08);
  text-decoration: none;
}

.subnav-link.router-link-active {
  background: var(--color-primary);
  color: #fff;
}

.main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  width: 100%;
}
</style>
