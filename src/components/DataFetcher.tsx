import React, { useCallback, useEffect } from 'react';
import { useAppContextValue } from './AppContext';
import { Card } from '../types';

const DataFetcher: React.FC = () => {
  const { setIsFetchingData, setData, user } = useAppContextValue();

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsFetchingData(true);
    const { cards, syncTimestamp } = await fetch(`${process.env.REACT_APP_CLOUD_FUNCTIONS_HOST}/api/cards`, {
      headers: {
        authorization: `Bearer ${await user.getIdToken().catch((error) => {
          // If network is down, just eat the exception and let fetch continue, and hopefully retrieve the cards from cache.
          if (error.code !== 'auth/network-request-failed') {
            throw Error;
          }
        })}`,
      },
    }).then(async (response) => ({
      syncTimestamp: new Date(response.headers.get('date')!),
      cards: (await response.json()) as Card[],
    }));
    setData({ cards, syncTimestamp });
    setIsFetchingData(false);
  }, [user, setData, setIsFetchingData]);

  useEffect(() => {
    (async () => fetchData())();
  }, [user, setData, setIsFetchingData, fetchData]);

  useEffect(() => {
    const callback = () => fetchData();
    window.addEventListener('focus', callback);
    return () => window.removeEventListener('focus', callback);
  }, [fetchData]);

  return null;
};

export default DataFetcher;
