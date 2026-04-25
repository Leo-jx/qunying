<script setup>
import AppHeader from '@/components/AppHeader.vue'

const nav = [
  { to: '/admin/dashboard', label: '统筹监管' },
  { to: '/admin/justice', label: '司法联动' },
  { to: '/admin/guide', label: '法治指导' },
  { to: '/admin/stats', label: '数据统计' },
]
</script>

<template>
  <div class="layout">
    <AppHeader title="管理协同端" />
    <nav class="subnav" aria-label="管理端导航">
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
  background: #2c3e50;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.subnav-link {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-decoration: none;
  min-height: var(--tap-min, 44px);
  display: inline-flex;
  align-items: center;
}

.subnav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.subnav-link.router-link-active {
  background: var(--color-accent);
  color: #1a1a1a;
}

.main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  width: 100%;
}
</style>
