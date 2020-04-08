import React from 'react';

import {
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { Movie } from '@material-ui/icons';

import UploadAction from './UploadAction';
import UploadProgress from './UploadProgress';

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingTop: '7px',
    paddingBottom: '7px',
    height: '53px',
  },
  movieIcon: {
    color: theme.palette.error.main,
    minWidth: '40px',
  },
  listaItemText: {
    marginLeft: '6px',
    marginRight: '24px',
    color: theme.palette.text.secondary,
  },
}));

export default function UploadItem({ children, ...rest }) {
  const classes = useStyles();

  return (
    <>
      <Tooltip title="Não foi possível" placement="left">
        <ListItem className={classes.listItem} button>
          <ListItemIcon className={classes.movieIcon}>
            <Movie />
          </ListItemIcon>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography variant="subtitle2" color="inherit" noWrap>
                {children}
              </Typography>
            }
          />
          <UploadAction />
          <UploadProgress size={30} />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
}
