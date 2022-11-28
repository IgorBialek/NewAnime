import { atom } from 'recoil';

import modal from '../models/modal';

export const modalAtom = atom<modal>({
  key: "modal",
  default: {
    showModal: false,
    modalChild: <></>,
  },
});
