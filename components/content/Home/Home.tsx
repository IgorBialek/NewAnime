import { signOut } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import { modalAtom } from '../../../atoms/modal';
import Button from '../../interface/Button';
import Modal from '../../interface/Modal';
import AddAnime from '../AddAnime/AddAnime';
import AnimeList from '../Anime/AnimeList';
import AnimeTileList from '../AnimeTiles/AnimeTileList';
import css from './Home.module.css';

const Home = () => {
  const { showModal, modalChild } = useRecoilValue(modalAtom);

  return (
    <div className={css.homeContainer}>
      {showModal && <Modal>{modalChild}</Modal>}
      <Button onClick={signOut} type={"secondary"}>
        Logout
      </Button>
      <AddAnime />
      <AnimeTileList />
      <AnimeList />
    </div>
  );
};

export default Home;
