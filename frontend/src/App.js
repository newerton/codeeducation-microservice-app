import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Breadcrumbs from './components/Breadcrumbs';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import history from './util/history';

import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <>
      <BrowserRouter>
        <Router history={history}>
          <div className={classes.root}>
            <CssBaseline />
            <Navbar />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Breadcrumbs />
              <AppRouter />
            </main>
          </div>
          <ToastContainer autoClose={3000} />
        </Router>
      </BrowserRouter>
    </>
  );
}
