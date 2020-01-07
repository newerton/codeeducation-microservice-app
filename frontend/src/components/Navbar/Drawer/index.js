import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import routes from './../../../routes'
import { Link } from 'react-router-dom';

// import { Container } from './styles';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const listRoutes = [
  'dashboard',
  'categories.list'
];
const menuRoutes = routes.filter(route => listRoutes.includes(route.name));

export default function Drawer({ open, toggleDrawer }) {
  const classes = useStyles();
  const drawer = (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {listRoutes.map((routeName, key) => {
          const route = menuRoutes.find(route => route.name === routeName);
          return (
            <ListItem button key={key} component={Link} to={route.path}>
              <ListItemIcon>{route.icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItem>
          );
        })}

      </List>
    </div>
  );

  return (
    <SwipeableDrawer
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      open={open}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      {drawer}
    </SwipeableDrawer>
  );
}
