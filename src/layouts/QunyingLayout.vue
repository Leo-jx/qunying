<script setup>
import AppHeader from '@/components/AppHeader.vue'

const nav = [
  { to: '/qunying/inbox', label: '纠纷承接' },
  { to: '/qunying/bench', label: '调解工作台' },
  { to: '/qunying/library', label: '法治智能库' },
  { to: '/qunying/publish', label: '结果公示' },
  { to: '/qunying/learn', label: '法律充电站' },
]
</script>

<template>
  <div class="layout">
    <AppHeader title="群英端" />
    <nav class="subnav" aria-label="群英端导航">
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
  background: #1e3d32;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.subnav-link {
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
  text-decoration: none;
  min-height: var(--tap-min, 44px);
  display: inline-flex;
  align-items: center;
}

.subnav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  text-decoration: none;
}

.subnav-link.router-link-active {
  background: #fff;
  color: var(--color-primary);
}

.main {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  width: 100%;
}
</style>
