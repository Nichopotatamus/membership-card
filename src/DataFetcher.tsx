import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';
import firebase from 'firebase';

type Props = {};

const DataFetcher: React.FC<Props> = ({ children }) => {
  const { setIsFetchingData, setData } = useAppContextValue();
  useEffect(() => {
    (async function fetchData() {
      setIsFetchingData(true);
      // @ts-ignore
      const db = firebase.firestore(window.firebaseApp);
      const data = await db
        .collection('cards')
        // @ts-ignore
        .where('uid', "==", firebase.auth().currentUser.uid )
        .get()
        .then((querySnapshot) => {
          const results: any[] = [];
          querySnapshot.forEach((doc) => {
            results.push({...doc.data(), id: doc.id});
          });
          return results;
        });
      setIsFetchingData(false);
      setData({cards: data});
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default DataFetcher;
