import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { modalAtom } from '../../atoms/modal';
import { observedAnimeListAtom } from '../../atoms/observedAnimeList';
import { firestore } from '../../firebase';
import observedAnime from '../../models/observedAnime';
import Button from '../interface/Button';
import Error from '../interface/Error';
import css from './AddAnime.module.css';

let pattern = ["https:", "", "desu-online.pl", "anime", "", ""];

const AddAnime = () => {
  const { data: session } = useSession();
  const [inputUrl, setInputUrl] = useState("");
  const observedAnimeList = useRecoilValue(observedAnimeListAtom);
  const setModal = useSetRecoilState(modalAtom);

  const hideModal = () => {
    setModal({ showModal: false, modalChild: <></> });
  };

  const addHandler = async () => {
    if (
      !inputUrl.split("/").every((s, i) => {
        if (i === 4) {
          return true;
        }

        if (s === pattern[i]) {
          return true;
        }

        return false;
      })
    ) {
      setModal({
        showModal: true,
        modalChild: (
          <Error
            title="Incorrect Url"
            message="This is not correct url format for anime. Try this https://desu-online.pl/anime/{ANIME NAME}/"
            handler={hideModal}
          />
        ),
      });

      return;
    }

    let email = session?.user?.email;

    if (email) {
      try {
        let anime: observedAnime = (
          await axios.post("/api/anime/getInitialStateForAnime", {
            url: inputUrl,
          })
        ).data;

        console.log(observedAnimeList, anime);

        if (observedAnimeList.some((a) => a.url === anime.url)) {
          setModal({
            showModal: true,
            modalChild: (
              <Error
                title="Repeat"
                message="You are already observing this anime!"
                handler={hideModal}
              />
            ),
          });

          setInputUrl("");
          return;
        }

        await setDoc(doc(firestore, "observedAnimeList", email), {
          observedAnimeList: [...observedAnimeList, anime],
        });
      } catch {
        setModal({
          showModal: true,
          modalChild: (
            <Error
              title="Error"
              message="Something went wrong 😕"
              handler={hideModal}
            />
          ),
        });
      }
    }

    setInputUrl("");
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.currentTarget.value);
  };

  return (
    <div className={css.addAnimeContainer}>
      <input
        type={"url"}
        className={css.input}
        placeholder={"https://desu-online.pl/anime/one-piece/"}
        value={inputUrl}
        onInput={inputHandler}
      />
      <Button onClick={addHandler}>Add</Button>
    </div>
  );
};

export default AddAnime;
