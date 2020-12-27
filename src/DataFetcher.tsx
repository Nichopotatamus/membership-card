import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';
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
      const { cards, syncTimestamp } = await fetch(`${process.env.REACT_APP_CLOUD_FUNCTIONS_HOST}/api/cards`, {
        headers: {
          authorization: `Bearer ${await user.getIdToken(true).catch((error) => {
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
    })();
  }, [user, counter, setData, setIsFetchingData]);

  return null;
};

export default DataFetcher;
