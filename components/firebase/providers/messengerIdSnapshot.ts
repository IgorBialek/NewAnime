import { doc, onSnapshot } from 'firebase/firestore';
import { SetterOrUpdater } from 'recoil';

import { firestore } from '../../../firebase';

const messengerIdSnapshot = (
  email: string,
  setMessengerId: SetterOrUpdater<string>
) => {
  return onSnapshot(doc(firestore, "messengerId", email), (doc) => {
    let { id } = doc.data() as {
      id: string;
    };

    if (id) {
      setMessengerId(id);
    }
  });
};

export default messengerIdSnapshot;
