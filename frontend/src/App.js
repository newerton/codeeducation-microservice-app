import React, { Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';

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

export default function App(props) {
  const classes = useStyles();

  return (
    <Fragment>
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
    </Fragment>

  );
}
