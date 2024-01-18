export type Song = {
  name: string;
  artists: string[];
  bannerSrc: string;
  bpm: number;
  map: {
    id: string;
    time: number;
    type: 'single';
    slot: number;
  }[];
};
