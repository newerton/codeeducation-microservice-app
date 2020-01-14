import React, { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '~/static/logo.png';

import Drawer from './Drawer';

// import { Container } from './styles';
const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: '#000',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  typography: {
    flexGrow: 1,
    textAlign: 'center',
  },
  logo: {
    width: 130,
    [theme.breakpoints.up('sm')]: {
      width: 170,
    },
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const [state, setState] = useState(false);

  const toggleDrawer = () => {
    setState(!state);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.typography} noWrap>
            <img src={logo} alt="" className={classes.logo} />
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer open={state} toggleDrawer={toggleDrawer} />
    </>
  );
}
