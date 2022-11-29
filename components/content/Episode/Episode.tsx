import { FC } from 'react';
import { RiDeleteRow } from 'react-icons/ri';

import newEpisode from '../../../models/newEpisode';
import css from './Episode.module.css';

const Episode: FC<{
  episode: newEpisode;
  onDelete: (number: number) => void;
}> = ({ episode, onDelete }) => {
  const openHandler = () => {
    if (window) {
      window.open(episode.url, "_blank");
    }
  };

  return (
    <div className={css.episodeContainer} onClick={openHandler}>
      <p className={css.number}>{episode.number}</p>
      <p className={css.title}>{episode.title}</p>
      <RiDeleteRow
        onClick={(e) => {
          e.stopPropagation();
          onDelete(episode.number);
        }}
      />
    </div>
  );
};
export default Episode;
