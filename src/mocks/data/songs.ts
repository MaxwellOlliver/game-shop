import { v4 as uuid } from 'uuid';
import { Song } from '../../store/types';

export default [
  {
    name: 'Ignite',
    artists: ['Zedd', 'League of Legends'],
    bannerSrc: '@/assets/imgs/ignite-banner.jpg',
    bpm: 128,
    map: [
      {
        id: uuid(),
        time: 5,
        type: 'single',
        slot: 1,
      },
      {
        id: uuid(),
        time: 7,
        type: 'single',
        slot: 7,
      },
      {
        id: uuid(),
        time: 9,
        type: 'single',
        slot: 4,
      },
      {
        id: uuid(),
        time: 12,
        type: 'single',
        slot: 6,
      },
      {
        id: uuid(),
        time: 15,
        type: 'single',
        slot: 3,
      },
      {
        id: uuid(),
        time: 17,
        type: 'single',
        slot: 5,
      },
    ],
  },
] as Song[];
