import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import theme from '~/theme';

import Breadcrumbs from './components/Breadcrumbs';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import history from './util/history';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(muiTheme => ({
  toolbar: muiTheme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: muiTheme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Router history={history}>
            <Navbar />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Breadcrumbs />
              <AppRouter />
            </main>
            <ToastContainer autoClose={3000} />
          </Router>
        </BrowserRouter>
      </MuiThemeProvider>
    </>
  );
}
