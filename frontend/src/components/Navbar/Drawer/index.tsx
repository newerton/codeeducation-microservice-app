import React from 'react';
import { Link } from 'react-router-dom';

import {
  SwipeableDrawer,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import routes from '../../../routes';
import { MyRouteProps } from '../../../routes';
import { People } from '@material-ui/icons';

interface DrawerProps {
  open: boolean;
  toggleDrawer: React.ReactEventHandler<{}>;
}

const useStyles = makeStyles(() => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

const iOS =
  (process as any).browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
const listRoutes = [
  'dashboard',
  'categories.list',
  'cast_members.list',
  'genres.list',
  'videos.list',
  'uploads.list',
];
const menuRoutes = routes.filter((route) => listRoutes.includes(route.name));

const Drawer: React.FC<DrawerProps> = ({ open, toggleDrawer }) => {
  const classes = useStyles();
  const drawer = (
    <div className={classes.list} role="presentation" onKeyDown={toggleDrawer}>
      <List>
        {listRoutes.map((routeName, key) => {
          const route: MyRouteProps | undefined = menuRoutes.find(
            (rt) => rt.name === routeName,
          );
          if (route) {
            return (
              <ListItem
                button
                key={key}
                component={Link}
                to={route.path}
                onClick={toggleDrawer}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.label} />
              </ListItem>
            );
          }
          return '';
        })}
        <Divider />
        <ListItem
          button
          component={MuiLink}
          href="http://"
          color={'textSecondary'}
          rel="noopener"
          target="_blank"
          onClick={toggleDrawer}
        >
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Usuários" />
        </ListItem>
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
};

export default Drawer;
