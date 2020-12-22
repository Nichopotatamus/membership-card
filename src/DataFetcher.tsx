import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';
import firebase from 'firebase/app';
import { Card } from './types';
import useInterval from './useInterval';

type Props = {};
const DataFetcher: React.FC<Props> = ({ children }) => {
  const { data, setIsFetchingData, setData, user } = useAppContextValue();
  const counter = useInterval(60 * 1000);
  useEffect(() => {
    if (!user) {
      return;
    }
    (async function fetchData() {
      setIsFetchingData(true);
      const db = firebase.firestore();
      const { syncTimestamp, cards } = await db
        .collection('cards')
        .where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => {
          const syncTimestamp = querySnapshot.metadata.fromCache ? data.syncTimestamp : new Date();
          if (syncTimestamp) {
            localStorage['syncTimestamp'] = syncTimestamp;
          }
          const cards = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Card[];
          return { syncTimestamp, cards };
        });
      setIsFetchingData(false);
      setData({ syncTimestamp, cards });
    })();
  }, [user, counter]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default DataFetcher;
