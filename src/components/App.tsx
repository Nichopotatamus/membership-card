import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Card from './Card';
import DataFetcher from './DataFetcher';
import Menu from './Menu';
import { AppContext, AppContextProvider } from './AppContext';
import QrReader from './QrReader';
import Login from './Login';
import CacheBuster from './CacheBuster';
import AuthState from './AuthState';
import SignUp from './SignUp';
import firebase from 'firebase/app';
import * as S from '../styles';

const App: React.FC = () => (
  <S.Wrapper>
    <BrowserRouter>
      <AppContextProvider>
        <AuthState />
        <CacheBuster />
        <S.GlobalStyle />
        <DataFetcher />
        <Navbar />
        <AppContext.Consumer>
          {({ isMenuActive, data }) =>
            isMenuActive ? (
              <Menu />
            ) : (
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => data.cards?.[0] && <Redirect to={`/cards/${data.cards[0].id}`} />}
                />
                <Route
                  exact
                  path="/cards/:cardId"
                  render={({
                    match: {
                      params: { cardId },
                    },
                  }) => <Card cardId={cardId} />}
                />
                <Route exact path={'/qr-reader'} component={QrReader} />
                <Route exact path={'/login'} component={Login} />
                <Route exact path={'/signup'} component={SignUp} />
                <Route
                  exact
                  path={'/logout'}
                  render={() => {
                    Promise.all([caches?.delete('cards'), firebase.auth().signOut()]).catch(() =>
                      window.location.reload()
                    );
                    return <Redirect to="/login" />;
                  }}
                />
              </Switch>
            )
          }
        </AppContext.Consumer>
      </AppContextProvider>
    </BrowserRouter>
  </S.Wrapper>
);

export default App;
