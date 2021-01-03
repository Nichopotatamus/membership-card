import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppContextValue } from './AppContext';

const StyledSpinner = styled.div`
  &,
  &:after {
    border-radius: 50%;
    width: 26px;
    height: 26px;
  }
  & {
    margin-top: 10px;
    margin-right: 10px;
    font-size: 6px;
    position: relative;
    text-indent: -9999em;
    border-top: 1.1em solid rgba(255, 255, 255, 0.2);
    border-right: 1.1em solid rgba(255, 255, 255, 0.2);
    border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
    border-left: 1.1em solid #ffffff;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
  }
  @-webkit-keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load8 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
`;

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
  return isVisible ? <StyledSpinner /> : <div />;
};

export default Spinner;
