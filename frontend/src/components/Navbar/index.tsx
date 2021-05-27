import React, { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import logo from '../../static/logo.png';

import Drawer from './Drawer';
import { useKeycloak } from '@react-keycloak/web';
import { AccountCircle } from '@material-ui/icons';

// import { Container } from './styles';
const useStyles = makeStyles((theme) => ({
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

const Navbar: React.FC = () => {
  const classes = useStyles();
  const [state, setState] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { keycloak, initialized } = useKeycloak();

  const isMenuOpen = Boolean(anchorEl);

  if (!initialized || !keycloak.authenticated) {
    return null;
  }

  const toggleDrawer = () => {
    setState(!state);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
  );

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
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Drawer open={state} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default Navbar;
