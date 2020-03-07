import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'toastr2/dist/toastr.min.css';

import LinearProgress from '~/components/LinearProgress';
import LoadingProvider from '~/components/Loading/LoadingProvider';
import theme from '~/theme';

import Breadcrumbs from './components/Breadcrumbs';
import Navbar from './components/Navbar';
import SnackbarProvider from './components/SnackbarProvider';
import AppRouter from './routes/AppRouter';
import history from './util/history';

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
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter>
              <Router history={history}>
                <LinearProgress />
                <Navbar />
                <main className={classes.content}>
                  <div className={classes.toolbar} />
                  <Breadcrumbs />
                  <AppRouter />
                </main>
              </Router>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </>
  );
}
