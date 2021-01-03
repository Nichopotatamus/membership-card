import React, { useContext, useEffect, useState } from 'react';
import { AppContext as AppContextType, Card, Data } from '../types';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import firebase from 'firebase/app';

// "undefined!" is a way to get around providing a default implementation of all setters,
// since consumers will be inside the provider and will always get an AppContextType object.
export const AppContext = React.createContext<AppContextType>(undefined!);

export const AppContextProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(
    !Boolean(
      matchPath(
        history.location.pathname,
        { path: '/login' } || matchPath(history.location.pathname, { path: '/signup' })
      )
    )
  );
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [data, setData] = useState<Data>({});
  const [version, setVersion] = useState('');
  const location = useLocation();

  useEffect(() => {
    (async () => getDataFromCache().then((data) => setData(data)))();
  }, []);

  useEffect(() => {
    setIsMenuActive(false);
  }, [location]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isFetchingData,
        setIsFetchingData,
        isLoggingIn,
        setIsLoggingIn,
        data,
        setData,
        version,
        setVersion,
        isMenuActive,
        setIsMenuActive,
      }}>
      {children}
    </AppContext.Provider>
  );
};

const getDataFromCache = () =>
  // Wrap in promise in case anything fails, due to no cached response or browser that does not support service workers
  new Promise<Data>((resolve) =>
    resolve(
      caches.open('cards').then((cache) =>
        cache.match(`${process.env.REACT_APP_CLOUD_FUNCTIONS_HOST}/api/cards`).then(async (response) => ({
          syncTimestamp: new Date(response!.headers.get('date')!),
          cards: (await response!.json()) as Card[],
        }))
      )
    )
  ).catch(() => ({}));

export const useAppContextValue = () => useContext(AppContext);
