import 'react-indiana-drag-scroll/dist/style.css';

import { doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useRecoilValue } from 'recoil';

import { observedAnimeListAtom } from '../../../atoms/observedAnimeList';
import { firestore } from '../../../firebase';
import AnimeTile from './AnimeTile';
import css from './AnimeTileList.module.css';

const AnimeTileList = () => {
  const { data: session } = useSession();
  const observedAnimeList = useRecoilValue(observedAnimeListAtom);

  const deleteHandler = async (name: string) => {
    let email = session?.user?.email;

    if (email) {
      await setDoc(doc(firestore, "observedAnimeList", email), {
        observedAnimeList: observedAnimeList.filter((a) => a.name !== name),
      });
    }
  };

  return (
    <div className={css.animeListContainer}>
      <ScrollContainer
        className={css.scrollContainer}
        mouseScroll={{ ignoreElements: "svg" }}
      >
        {observedAnimeList.map((a) => (
          <AnimeTile key={a.name} name={a.name} onDelete={deleteHandler} />
        ))}
      </ScrollContainer>
    </div>
  );
};

export default AnimeTileList;
