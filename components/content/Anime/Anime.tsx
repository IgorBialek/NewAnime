import Image from 'next/image';
import { FC, useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { useMediaQuery } from 'react-responsive';

import observedAnime from '../../../models/observedAnime';
import EpisodeList from '../Episode/EpisodeList';
import css from './Anime.module.css';

const Anime: FC<{ anime: observedAnime }> = ({ anime }) => {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [isExpanded, setIsExpanded] = useState(false);

  const expandHandler = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className={css.animeContainer}>
      <div
        className={`${css.animeTitle} ${isExpanded ? css.expanded : ""}`}
        onClick={expandHandler}
      >
        <Image src={anime.image} width={40} height={40} alt="Anime Image" />
        <p className={isMobile ? css.mobileName : ""}>{anime.name}</p>
        <div className={css.actions}>
          {isExpanded ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </div>
      </div>
      {isExpanded && (
        <EpisodeList episodes={anime.episodes} animeName={anime.name} />
      )}
    </div>
  );
};

export default Anime;
