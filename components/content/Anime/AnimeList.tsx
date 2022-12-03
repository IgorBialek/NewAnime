import { useRecoilValue } from 'recoil';

import { observedAnimeListAtom } from '../../../atoms/observedAnimeList';
import Anime from './Anime';
import css from './AnimeList.module.css';

const AnimeList = () => {
  const observedAnimeList = useRecoilValue(observedAnimeListAtom);

  if (observedAnimeList.length === 0) {
    return <h1 className={css.noItems}>Add some anime to observe!</h1>;
  }

  return (
    <div className={css.animeListContainer}>
      {observedAnimeList.map((a) => (
        <Anime key={a.name} anime={a} />
      ))}
    </div>
  );
};

export default AnimeList;
