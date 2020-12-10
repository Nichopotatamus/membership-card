import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

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
// Initialize Firebase
// @ts-ignore
window.firebaseApp = firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  } else {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      // Other config options...
    });
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
