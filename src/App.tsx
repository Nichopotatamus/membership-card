import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import Card from './Card';
import DataFetcher from './DataFetcher';

import { createGlobalStyle } from 'styled-components/macro';
import Menu from './Menu';
import { AppContextProvider, useAppContextValue, AppContext } from './AppContext';
import QrReader from './QrReader';
import Login from './Login';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    overflow: hidden;
    background-color: black;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  #root { // https://stackoverflow.com/questions/1719452/how-to-make-a-div-always-full-screen
    display: flex;
    flex-direction: column;
    width: ${window.innerWidth}px;
    height: ${window.innerHeight}px;
  }
`;

const App = () => {
  const { data } = useAppContextValue();
  return (
    <BrowserRouter>
      <AppContextProvider>
        <GlobalStyle />
        <DataFetcher />
        <Navbar />
        <AppContext.Consumer>
          {({ isMenuActive }) =>
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
              </Switch>
            )
          }
        </AppContext.Consumer>
      </AppContextProvider>
    </BrowserRouter>
  );
};

export default App;
