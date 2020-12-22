import React, {useEffect} from 'react';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import {useAppContextValue} from "./AppContext";


const AuthState: React.FC = () => {
  const history = useHistory();
  const {setUser} = useAppContextValue();
  useEffect(() => {
    const stopListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUser(user);
        history.push('/')
      } else {
        setUser(null);
        //history.push('/login')
      }
    });
    return () => stopListener();
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default AuthState;
