<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AiBoundaryNote from '@/components/AiBoundaryNote.vue'
import AiChatBox from '@/components/AiChatBox.vue'

const portals = [
  {
    to: '/public',
    title: '群众端',
    desc: '一键申请纠纷、查看三公开信息、跟进进度、评价监督。',
    icon: '👥',
  },
  {
    to: '/qunying',
    title: '群英端',
    desc: '承接纠纷、线上线下调解、法治库与协议模板、结果脱敏公示。',
    icon: '🛡️',
  },
  {
    to: '/admin',
    title: '管理协同端',
    desc: '统筹督办、司法数据联动、法治指导、统计分析。',
    icon: '🏛️',
  },
]
</script>

<template>
  <div class="portal-page">
    <AppHeader title="" />
    <section class="hero">
      <h1 class="hero-title">群英断是非 · 数字化调解平台</h1>
      <p class="hero-lead">
        以群英为主导、群众为主体、法治为底线、数字为支撑。全流程留痕与「三公开」阳光机制，助力基层矛盾化解。
      </p>
    </section>

    <section class="portals" aria-label="选择入口">
      <router-link v-for="p in portals" :key="p.to" :to="p.to" class="portal-card">
        <span class="portal-icon" aria-hidden="true">{{ p.icon }}</span>
        <h2>{{ p.title }}</h2>
        <p>{{ p.desc }}</p>
        <span class="portal-cta">进入</span>
      </router-link>
    </section>

    <div class="ai-block">
      <AiBoundaryNote />
      <AiChatBox />
    </div>

    <footer class="foot">
    </footer>
  </div>
</template>

<style scoped>
.portal-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 0.5rem;
  text-align: center;
}

.hero-title {
  font-size: 1.5rem;
  color: var(--color-primary);
  margin: 0 0 0.75rem;
  line-height: 1.35;
}

.hero-lead {
  color: var(--color-text-muted);
  margin: 0 0 1rem;
}

.portals {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  flex: 1;
}

@media (min-width: 640px) {
  .portals {
    grid-template-columns: repeat(3, 1fr);
  }
}

.portal-card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.35rem;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow);
  transition: transform 0.15s, box-shadow 0.15s;
}

.portal-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 95, 74, 0.12);
  text-decoration: none;
}

.portal-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.portal-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  color: var(--color-primary);
}

.portal-card p {
  margin: 0 0 1rem;
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.portal-cta {
  font-weight: 700;
  color: var(--color-primary-light);
}

.ai-block {
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  padding: 0 1rem 1.25rem;
}

.foot {
  text-align: center;
  padding: 1.5rem 1rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.foot p {
  margin: 0;
  max-width: 560px;
  margin-inline: auto;
}
</style>
