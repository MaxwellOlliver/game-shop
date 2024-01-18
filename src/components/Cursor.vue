<template>
  <div role="cursor" ref="cursorRef" />
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const cursorRef = ref<HTMLDivElement | null>(null);

function handleMouseMove(e: MouseEvent) {
  document
    .querySelector('[role="cursor"]')
    ?.setAttribute(
      'style',
      `top: ${e.pageX}px; left: ${e.pageY}px`,
    );
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>
<style scoped>
[role="cursor"] {
  background: #778da9;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 10px #778da9;
  z-index: 999;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>