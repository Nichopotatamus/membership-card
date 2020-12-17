import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';
import firebase from 'firebase';
import { Card } from './types';
import useInterval from './useInterval';

type Props = {};
const DataFetcher: React.FC<Props> = ({ children }) => {
  const { setIsFetchingData, setData } = useAppContextValue();
  const counter = useInterval(60 * 1000);

  useEffect(() => {
    (async function fetchData() {
      setIsFetchingData(true);
      // @ts-ignore
      const db = firebase.firestore(window.firebaseApp);
      const data = (await db
        .collection('cards')
        // @ts-ignore
        .where('email', '==', firebase.auth().currentUser.email)
        .get()
        .then((querySnapshot) => querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))) as Card[];
      setIsFetchingData(false);
      setData({ syncTimestamp: new Date(), cards: data });
    })();
  }, [counter]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default DataFetcher;
