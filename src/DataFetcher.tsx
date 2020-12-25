import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';
import firebase from 'firebase/app';
import { Card } from './types';
import useInterval from './useInterval';

const DataFetcher: React.FC = () => {
  const { setIsFetchingData, setData, user } = useAppContextValue();
  const counter = useInterval(60 * 1000);

  useEffect(() => {
    if (!user) {
      setData({ cards: [] });
      return;
    }
    (async function fetchData() {
      setIsFetchingData(true);
      const db = firebase.firestore();
      const { fromCache, cards } = await db
        .collection('cards')
        .where('uid', '==', user.uid)
        .get()
        .then((querySnapshot) => ({
          fromCache: querySnapshot.metadata.fromCache,
          cards: querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Card[],
        }));
      setData((previousData) => {
        const syncTimestamp = fromCache ? previousData.syncTimestamp : new Date();
        if (syncTimestamp) {
          localStorage['syncTimestamp'] = syncTimestamp;
        }
        return { syncTimestamp, cards };
      });
      setIsFetchingData(false);
    })();
  }, [user, counter, setData, setIsFetchingData]);

  return null;
};

export default DataFetcher;
