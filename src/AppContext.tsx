import React, { useContext, useEffect, useState } from 'react';
import { AppContext as AppContextType, Data } from './types';
import { useLocation } from 'react-router-dom';
import firebase from 'firebase/app';

export const AppContext = React.createContext<AppContextType>({
  user: null,
  setUser: () => {},
  isFetchingData: false,
  setIsFetchingData: () => {},
  isMenuActive: false,
  setIsMenuActive: () => {},
  data: {},
  setData: () => {},
});

export const AppContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [data, setData] = useState<Data>({});
  const location = useLocation();

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
