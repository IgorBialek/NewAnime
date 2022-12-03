import { doc, onSnapshot } from 'firebase/firestore';
import { SetterOrUpdater } from 'recoil';

import { firestore } from '../../../firebase';
import observedAnime from '../../../models/observedAnime';

const observedAnimeListSnapshot = (
  email: string,
  setObservedAnimeList: SetterOrUpdater<observedAnime[]>
) => {
  return onSnapshot(doc(firestore, "observedAnimeList", email), (doc) => {
    let data = doc.data() as {
      observedAnimeList: observedAnime[];
    };

    if (data && data.observedAnimeList) {
      setObservedAnimeList(data.observedAnimeList);
    }
  });
};

export default observedAnimeListSnapshot;
