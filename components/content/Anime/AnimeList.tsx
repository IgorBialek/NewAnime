import { useRecoilValue } from 'recoil';

import { observedAnimeListAtom } from '../../../atoms/observedAnimeList';
import Anime from './Anime';
import css from './AnimeList.module.css';

const AnimeList = () => {
  const observedAnimeList = useRecoilValue(observedAnimeListAtom);

  return (
    <div className={css.animeListContainer}>
      {observedAnimeList.map((a) => (
        <Anime anime={a} />
      ))}
    </div>
  );
};

export default AnimeList;
