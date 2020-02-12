import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';

// React-redux
import { Provider } from 'react-redux'
import store from './redux/store'
import { getProducts } from './redux/actions/dataActions'
import { getUserData } from './redux/actions/userActions'

// Components
import Navbar from './components/Navbar';

// MUI stuff
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './util/theme';

// Pages
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import newList from './pages/newList';
import storedLists from './pages/storedLists';
import list from './pages/list';
import layout from './pages/layout';
import database from './pages/database';

// Firebase
import { auth } from './backend/firebaseInit'

// Components
import AuthRoute from './components/AuthRoute';
import PageLayout  from './components/pageLayout';

//firebaseInit()

const theme = createMuiTheme(themeFile);

store.dispatch(getProducts());

function App() {
  const [authChecked, setauthChecked] = useState(false);

  useEffect(() => {
    const unSub = auth.onAuthStateChanged(user => {
      console.log("Auth observer triggered")
        if (user && user.emailVerified) {
          console.log("User is logged in")
          store.dispatch(getUserData(user.uid))
        }
      setauthChecked(true)
      unSub();
      })      
  }, [])

  return (
    
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
        <Router>
          {authChecked ? (
          <Fragment>
            <Navbar />
              <Switch>
                <Route exact path="/layout" component={layout} />
                <Route exact path="/database" component={database} />

                <Route exact path="/" component={home} />
                <Route exact path="/login" component={login} />
                <Route exact path="/signup" component={signup} />
                <AuthRoute path="/new-list" component={newList} />
                <AuthRoute exact path="/stored-lists" component={storedLists} />
                <Route exact path="/stored-lists/:listId" component={list} />
              </Switch>
            </Fragment>
          ) : (
            <Fragment>
              <Navbar isFake={true}/>              
              <PageLayout isFake={true}/>
            </Fragment>
          )}
          </Router>
        </Provider>
      </MuiThemeProvider>
    
  );
}

export default App;
