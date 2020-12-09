import React, { useContext, useEffect, useState } from 'react';
import { AppContext as AppContextType, Data } from './types';
import { useLocation } from 'react-router-dom';

const getCachedData = () => {
  const cachedData = localStorage['cachedData'];
  if (cachedData) {
    return JSON.parse(cachedData);
  }
};

export const AppContext = React.createContext<AppContextType>({
  isLoggedIn: true,
  setIsLoggedIn: () => {},
  isFetchingData: false,
  setIsFetchingData: () => {},
  isMenuActive: false,
  setIsMenuActive: () => {},
  data: getCachedData() || {},
  setData: () => {},
});

export const AppContextProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [data, setData] = useState<Data>({});
  const location = useLocation();

  useEffect(() => {
    isMenuActive && setIsMenuActive(false);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isFetchingData,
        setIsFetchingData,
        data,
        setData,
        isMenuActive,
        setIsMenuActive,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContextValue = () => useContext(AppContext);
