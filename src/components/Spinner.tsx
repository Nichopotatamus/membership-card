import React, { useEffect, useRef, useState } from 'react';
import { useAppContextValue } from './AppContext';
import * as S from '../styles';

const Spinner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>();
  const { isLoggingIn, isFetchingData, user, data } = useAppContextValue();
  const isLoading = isLoggingIn || isFetchingData || (user && !data.cards);

  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => setIsVisible(true), 500);
    } else if (!isLoading) {
      clearTimeout(timeoutRef.current);
      setIsVisible(false);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [isLoading, setIsVisible]);
  return isVisible ? <S.Spinner /> : <div />;
};

export default Spinner;
