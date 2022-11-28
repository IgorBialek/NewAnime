import { atom } from 'recoil';

import observedAnime from '../models/observedAnime';

export const observedAnimeListAtom = atom<observedAnime[]>({
  key: "observedAnimeList",
  default: [],
});
