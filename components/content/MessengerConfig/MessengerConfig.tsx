import { doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { messengerIdAtom } from '../../../atoms/messengerId';
import { modalAtom } from '../../../atoms/modal';
import { firestore } from '../../../firebase';
import Guide from '../../guide/Guide';
import Button from '../../interface/Button';
import css from './MessengerConfig.module.css';

const MessengerConfig = () => {
  const { data: session } = useSession();
  const messengerId = useRecoilValue(messengerIdAtom);
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const setModal = useSetRecoilState(modalAtom);

  const saveHandler = async () => {
    let email = session?.user?.email;

    if (email) {
      await setDoc(doc(firestore, "messengerId", email), {
        id: inputRef.current?.value,
      });
    }

    setIsEditable(false);
  };

  useEffect(() => {
    if (isEditable) {
      inputRef.current?.focus();
    }
  }, [isEditable]);

  const guideHandler = () => {
    setModal({ showModal: true, modalChild: <Guide onClick={closeHandler} /> });
  };

  const closeHandler = () => {
    setModal({ showModal: false, modalChild: <></> });
  };

  return (
    <div className={css.wrapper}>
      {isEditable ? (
        <input
          ref={inputRef}
          defaultValue={messengerId}
          type={"text"}
          onBlur={saveHandler}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveHandler();
          }}
        />
      ) : (
        <Button
          type="secondary"
          className={css.button}
          onClick={setIsEditable.bind(this, true)}
        >
          Set Messenger Id
        </Button>
      )}
      <p onClick={guideHandler}>How to get id?</p>
    </div>
  );
};

export default MessengerConfig;
