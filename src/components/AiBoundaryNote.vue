<script setup>
defineProps({
  compact: { type: Boolean, default: false },
})
</script>

<template>
  <aside class="ai-note" :class="{ compact }" role="note">
    <span class="tag tag-ai">AI 辅助</span>
    <p v-if="!compact">
      本平台中 AI 仅用于效率辅助、合规提示与资料整理，<strong>不替代群英判断是非、作出决策</strong>。调解结论须由群英自主商定并确认。
    </p>
    <p v-else>AI 仅辅助，决策权在群英。</p>
  </aside>
</template>

<style scoped>
.ai-note {
  background: #f0f7f4;
  border-left: 4px solid var(--color-primary);
  padding: 0.85rem 1rem;
  border-radius: 0 var(--radius) var(--radius) 0;
  margin: 1rem 0;
}

.ai-note.compact {
  margin: 0.5rem 0;
  padding: 0.5rem 0.75rem;
}

.ai-note p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.ai-note.compact p {
  margin: 0.35rem 0 0;
  display: inline;
  margin-left: 0.35rem;
}
</style>

