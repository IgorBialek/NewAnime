import { FC } from 'react';
import { RiCloseFill } from 'react-icons/ri';

import css from './Anime.module.css';

const Anime: FC<{ name: string; onDelete: (name: string) => void }> = ({
  name,
  onDelete,
}) => {
  return (
    <div className={css.animeContainer}>
      <p>{name}</p>
      <RiCloseFill onClick={() => onDelete(name)} />
    </div>
  );
};

export default Anime;
