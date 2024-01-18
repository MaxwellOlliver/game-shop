import { reactive } from 'vue';
import type { Song } from './types';
import songs from '../mocks/data/songs';

interface IMatchStore {
  song: Song;
  getSongUrl(): string;
}

export const matchStore = reactive<IMatchStore>({
  song: songs[0],
  getSongUrl() {
    return new URL(
      `../assets/songs/${this.song.name.toLowerCase()}.mp3`,
      import.meta.url,
    ).href;
  },
});
