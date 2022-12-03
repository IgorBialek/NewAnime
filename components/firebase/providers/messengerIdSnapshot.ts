import { doc, onSnapshot } from 'firebase/firestore';
import { SetterOrUpdater } from 'recoil';

import { firestore } from '../../../firebase';

const messengerIdSnapshot = (
  email: string,
  setMessengerId: SetterOrUpdater<string>
) => {
  return onSnapshot(doc(firestore, "messengerId", email), (doc) => {
    let data = doc.data() as {
      id: string;
    };

    if (data && data.id) {
      setMessengerId(data.id);
    }
  });
};

export default messengerIdSnapshot;
