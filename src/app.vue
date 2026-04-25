<script setup>
import { provide, ref, watch } from 'vue'

const elderMode = ref(localStorage.getItem('elderMode') === '1')
watch(elderMode, (v) => {
  localStorage.setItem('elderMode', v ? '1' : '0')
  document.documentElement.classList.toggle('elder-mode', v)
})
if (elderMode.value) {
  document.documentElement.classList.add('elder-mode')
}
provide('elderMode', elderMode)
</script>

<template>
  <router-view />
</template>
