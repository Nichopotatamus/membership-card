import React, { useEffect } from 'react';
import { useAppContextValue } from './AppContext';

type Props = {};

const DataFetcher: React.FC<Props> = ({ children }) => {
  const { setIsFetchingData, setData } = useAppContextValue();
  useEffect(() => {
    (async function fetchData() {
      setIsFetchingData(true);
      const data = await fetch('https://qr-mockend.kink.no/user')
        .then((response) => response.json())
        .catch((error) => {
          const cachedData = localStorage['cachedData'];
          if (cachedData) {
            return JSON.parse(cachedData);
          } else {
            alert('No cached data found');
            throw error;
          }
        });
      localStorage['cachedData'] = JSON.stringify(data);
      localStorage['syncTimestamp'] = new Date();
      setIsFetchingData(false);
      setData(data);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default DataFetcher;
