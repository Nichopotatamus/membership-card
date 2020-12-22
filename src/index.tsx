import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDua0RvTx_ylBOFuJinB0EYvdnXnj_i64o',
  authDomain: 'skog-og-mark.firebaseapp.com',
  databaseURL: 'https://skog-og-mark.firebaseio.com',
  projectId: 'skog-og-mark',
  storageBucket: 'skog-og-mark.appspot.com',
  messagingSenderId: '168006134939',
  appId: '1:168006134939:web:fe08e25a0937c62b7b2a3e',
};

firebase.initializeApp(firebaseConfig);

if (window.location.hostname === 'localhost') {
  firebase.firestore().useEmulator('localhost', 8080);
}

firebase
  .firestore()
  .enablePersistence()
  .catch((error) => {
    if (error.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      // ...
      console.error('Firestore enablePersistence: failed-precondition');
    } else if (error.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      // ...
      console.error('Firestore enablePersistence: unimplemented');
    }
  });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
