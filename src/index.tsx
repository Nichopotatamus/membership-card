import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

import firebase from 'firebase/app';
import 'firebase/auth';

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
