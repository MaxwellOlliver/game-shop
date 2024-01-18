<template>
  <div class="container">
    <GamePanel />
  </div>
</template>
<script setup lang="ts">
import GamePanel from '../components/GamePanel.vue';
</script>
<style scoped>
.container {
  background: #1b263b;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: none;
}
</style>
