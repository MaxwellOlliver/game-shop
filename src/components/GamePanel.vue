<template>
  <main class="main">
    <section class="song-data">
      <button type="button" @click="play">play</button>
      <span>multiplier: {{ score.multiplier }}x</span>
      <span>score: {{ score.score }}</span>
      <span>perfect: {{ score.perfect }}</span>
      <span>good: {{ score.good }}</span>
      <span>bad: {{ score.bad }}</span>
      <span>miss: {{ score.miss }}</span>
      <span>timer: {{ player.time }}</span>xx
    </section>
    <audio :src="audioSrc" ref="audioPlayerRef" autoplay @timeupdate="handleTimeUpdate" />
    <div id="slot-panel" class="slot-panel">
      <div v-for="slot in slots.slice(0, 4)" @mouseenter="handleMouseHover(slot)" @mouseleave="handleMouseLeave"
        class="slot" role="slot" :data-slot="slot">
        <div v-for="note in slotsNotes[slot]" class="square" role="square" :data-note-id="note.id">
          <div class="square-aura" @animationend="handleMiss"></div>
        </div>
      </div>
      <div />
      <div v-for="slot in slots.slice(4)" class="slot" role="slot" :data-slot="slot">
        <div v-for="note in slotsNotes[slot]" class="square" role="square" :data-note-id="note.id">
          <div class="square-aura" @animationend="handleMiss">
            {{ note.time }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { reactive, onMounted, onUnmounted, ref, computed } from 'vue';
import { gameConfigStore } from '../store/game-config';
import { matchStore } from '../store/match';
import { Song } from '../store/types';

const slots = [1, 2, 3, 4, 5, 6, 7, 8]

const slotsNotes = reactive<{ [key: number]: Song['map'] }>({
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
});
const cursorPosition = reactive({
  x: 0,
  y: 0,
});
const mouseHovering = ref<number | null>(null);
const audioPlayerRef = ref<HTMLAudioElement | null>(null);
const player = reactive({
  time: 0,
  duration: 0,
  isPaused: true,
})

const score = reactive({
  perfect: 0,
  good: 0,
  bad: 0,
  miss: 0,
  multiplier: 1,
  score: 0,
})

const audioSrc = computed(() => matchStore.getSongUrl())

function handleTimeUpdate() {
  const currentTime = audioPlayerRef.value?.currentTime!;

  player.time = currentTime || 0;
  player.duration = audioPlayerRef.value?.duration || 0;
}

function handleHit() {
  const target = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
  const slot = target?.parentElement?.parentElement?.dataset.slot;
  console.log(slot)

  if (!slot) {
    score.miss += 1;
    score.multiplier = 1;
    return;
  };

  const slotNumber = Number(slot)

  const noteIndex = slotsNotes[slotNumber].findIndex((note) => {
    return player.time >= note.time - 0.3 && player.time <= note.time;
  });

  console.log(noteIndex)

  if (noteIndex === -1) return;

  const note = slotsNotes[slotNumber][noteIndex];

  const difference = Math.abs(note.time - player.time);

  if (difference <= 0.05) {
    score.perfect += 1;
    score.multiplier += 1;
    score.score += 100 * score.multiplier;
  } else if (difference <= 0.1) {
    score.good += 1;
    score.multiplier += 1;
    score.score += 50 * score.multiplier;
  } else if (difference <= 0.2) {
    score.bad += 1;
    score.multiplier += 1;
    score.score += 10 * score.multiplier;
  } else {
    score.miss += 1;
    score.multiplier = 1;
  }

  slotsNotes[slotNumber].splice(noteIndex, 1);
}

function handleMiss(e: AnimationEvent) {
  if (!/^aura-animation/.test(e.animationName)) return;

  const target = e.target as HTMLElement;
  const slot = target.parentElement?.parentElement?.dataset.slot;

  if (!slot) return;

  const noteId = target.parentElement?.dataset.noteId;

  if (!noteId) return;

  const noteIndex = slotsNotes[Number(slot)].findIndex((note) => note.id === noteId);

  if (noteIndex === -1) return;

  slotsNotes[Number(slot)] = slotsNotes[Number(slot)].filter((note) => note.id !== noteId);
  score.miss += 1;
  score.multiplier = 1;
}

function play() {
  audioPlayerRef.value?.play();
  player.isPaused = false;
}

function handleMouseHover(slot: number) {
  mouseHovering.value = slot;
}

function handleMouseLeave() {
  mouseHovering.value = null;
}

function handleMouseMove(e: MouseEvent) {
  cursorPosition.x = e.pageX * gameConfigStore.sensitivity;
  cursorPosition.y = e.pageY * gameConfigStore.sensitivity;

  document
    .querySelector('[role="cursor"]')
    ?.setAttribute(
      'style',
      `top: ${cursorPosition.y}px; left: ${cursorPosition.x}px`,
    );
}

function handleKeypress(e: KeyboardEvent) {
  if (['z', 'x'].includes(e.key)) {
    handleHit();
  }
}

onMounted(() => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.volume = 0.2;
    audioPlayerRef.value.addEventListener('ended', () => {
      player.isPaused = true;
    });
  }
  window.addEventListener('keydown', handleKeypress)
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeypress)
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>
<style scoped>
.main {
  background: #1b263b;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.slot-panel {
  width: 450px;
  height: 450px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 4rem;
}


.song-data {
  display: flex;
  flex-direction: column;
  color: #e0e1dd;
}

.slot {
  width: 100%;
  height: 100%;
  position: relative;
}

.square {
  width: 100%;
  height: 100%;
  background-color: #e0e1dd;
  box-shadow: 0 0 30px 2px #e0e1dd60;
  border-radius: 0.625rem;
  animation-name: slot-animation;
  animation-duration: 0.5s;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.square-aura {
  position: absolute;
  width: 150%;
  height: 150%;
  border: 2px solid #e0e1dd;
  box-shadow: 0 0 10px 0px #e0e1dd60;
  border-radius: 2rem;
  animation-name: aura-animation;
  animation-duration: 1s;
  animation-delay: 0.5s;
  animation-fill-mode: forwards;
  opacity: 0;
}

@keyframes slot-animation {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes aura-animation {
  0% {
    transform: scale(1);
    opacity: 0;
  }

  100% {
    transform: scale(0.667);
    opacity: 1;
  }
}
</style>