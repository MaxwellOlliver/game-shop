import { reactive } from 'vue';

export const gameConfigStore = reactive({
  sensitivity: 1,
  changeSensitivity: (value: number) => {
    if (value < 0) value = 0;
    if (value > 3) value = 3;

    gameConfigStore.sensitivity = value;
  },
});
