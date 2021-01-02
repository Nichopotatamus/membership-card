import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import Card from './Card';
import DataFetcher from './DataFetcher';

import { createGlobalStyle } from 'styled-components/macro';
import Menu from './Menu';
import { AppContextProvider, AppContext } from './AppContext';
import QrReader from './QrReader';
import Login from './Login';
import CacheBuster from './CacheBuster';
import AuthState from './AuthState';
import SignUp from './SignUp';
import firebase from 'firebase/app';
import styled from 'styled-components';
import { gray1 } from '../stylingVariables';

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  body {
    margin: 0;
    overflow: auto;
    background-color: black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
  }
  #root {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 500px;
  max-height: 900px;
  @media (min-width: 502px) {
    border-left: 1px solid ${gray1};
    border-right: 1px solid ${gray1};
  }
  @media (min-width: 504px) {
    border-left: 2px solid ${gray1};
    border-right: 2px solid ${gray1};
  }
  @media (min-height: 902px) {
    border-top: 1px solid ${gray1};
    border-bottom: 1px solid ${gray1};
  }
  @media (min-height: 904px) {
    border-top: 2px solid ${gray1};
    border-bottom: 2px solid ${gray1};
  }
`;

const App = () => (
  <StyledWrapper>
    <BrowserRouter>
      <AppContextProvider>
        <AuthState />
        <CacheBuster />
        <GlobalStyle />
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
                    firebase
                      .auth()
                      .signOut()
                      .catch(() => window.location.reload());
                    return <Redirect to="/login" />;
                  }}
                />
              </Switch>
            )
          }
        </AppContext.Consumer>
      </AppContextProvider>
    </BrowserRouter>
  </StyledWrapper>
);

export default App;
