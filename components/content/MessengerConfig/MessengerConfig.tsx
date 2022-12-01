import { doc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { messengerIdAtom } from '../../../atoms/messengerId';
import { firestore } from '../../../firebase';
import css from './MessengerConfig.module.css';

const MessengerConfig = () => {
  const { data: session } = useSession();
  const messengerId = useRecoilValue(messengerIdAtom);
  const [isEditable, setIsEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className={css.wrapper}>
      <div
        className={css.messengerContainer}
        onClick={setIsEditable.bind(this, true)}
      >
        Messenger Id:
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
          <p>{messengerId}</p>
        )}
      </div>
    </div>
  );
};

export default MessengerConfig;
