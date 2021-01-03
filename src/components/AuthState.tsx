import React, { useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import { useHistory, matchPath } from 'react-router-dom';
import { useAppContextValue } from './AppContext';

const AuthState: React.FC = () => {
  const history = useHistory();
  const { setUser, setIsLoggingIn } = useAppContextValue();
  const didMountRef = useRef(false);
  useEffect(() => {
    const stopListener = firebase.auth().onAuthStateChanged((user) => {
      setIsLoggingIn(false);
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        setUser(null);
        if (
          didMountRef.current &&
          (matchPath(history.location.pathname, { path: '/cards/:cardId' }) ||
            matchPath(history.location.pathname, { path: '/', exact: true }))
        ) {
          history.push('/login');
        }
      }
    });
    didMountRef.current = true;
    return () => stopListener();
  }, [setUser, history]);
  return null;
};

export default AuthState;
