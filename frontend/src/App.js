import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Breadcrumbs from './components/Breadcrumbs';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';

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
        <div className={classes.root}>
          <CssBaseline />
          <Navbar />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Breadcrumbs />
            <AppRouter />
          </main>
        </div>
      </BrowserRouter>
    </>
  );
}
