import { Unsubscribe } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { observedAnimeListAtom } from '../../atoms/observedAnimeList';
import observedAnimeListSnapshot from './providers/observedAnimeListSnapshot';

const SnapshotProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: session } = useSession();
  const setObservedAnimeList = useSetRecoilState(observedAnimeListAtom);

  useEffect(() => {
    let email = session?.user?.email;
    let unsubscribes: Unsubscribe[] = [];

    if (email) {
      unsubscribes = [observedAnimeListSnapshot(email, setObservedAnimeList)];
    }

    return () => {
      unsubscribes.forEach((u) => {
        u();
      });
    };
  }, [session]);

  return <>{children}</>;
};

export default SnapshotProvider;
