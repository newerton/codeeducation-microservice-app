import React, { useState } from 'react';

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

import { hasError } from '~/store/upload/getters';

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

export default function UploadItem({ upload, ...rest }) {
  const classes = useStyles();
  const error = hasError(upload);
  const [itemHover, setItemHover] = useState(false);

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={
          error
            ? 'Não foi possível fazer o upload, clique para mais detalhes'
            : ''
        }
        placement="left"
      >
        <ListItem
          className={classes.listItem}
          button
          onMouseOver={() => setItemHover(true)}
          onMouseLeave={() => setItemHover(false)}
        >
          <ListItemIcon className={classes.movieIcon}>
            <Movie />
          </ListItemIcon>
          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography variant="subtitle2" color="inherit" noWrap>
                {upload.video.title}
              </Typography>
            }
          />
          <UploadProgress size={30} uploadOrFile={upload} />
          <UploadAction upload={upload} hover={itemHover} />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
}
