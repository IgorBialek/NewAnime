import { doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { observedAnimeListAtom } from '../../../atoms/observedAnimeList';
import { firestore } from '../../../firebase';
import newEpisode from '../../../models/newEpisode';
import Episode from './Episode';
import css from './EpisodeList.module.css';

const EpisodeList: FC<{ episodes: newEpisode[]; animeName: string }> = ({
  episodes,
  animeName,
}) => {
  const { data: session } = useSession();
  const observedAnimeList = useRecoilValue(observedAnimeListAtom);

  const deleteHandler = async (number: number) => {
    let email = session?.user?.email;

    if (email) {
      await setDoc(doc(firestore, "observedAnimeList", email), {
        observedAnimeList: observedAnimeList.map((a) => {
          if (a.name === animeName) {
            return {
              ...a,
              episodes: a.episodes.filter((e) => e.number !== number),
            };
          }

          return a;
        }),
      });
    }
  };

  return (
    <div className={css.episodeListContainer}>
      {episodes.map((e) => (
        <Episode key={e.number} episode={e} onDelete={deleteHandler} />
      ))}
    </div>
  );
};
export default EpisodeList;
