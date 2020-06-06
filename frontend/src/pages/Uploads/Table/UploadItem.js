import React from 'react';

import { makeStyles, Typography, Grid, ListItem } from '@material-ui/core';
import { Movie, Image } from '@material-ui/icons';

import UploadProgress from '~/components/SnackbarUpload/UploadProgress';

import UploadAction from './UploadAction';

const useStyles = makeStyles(theme => ({
  gridTitle: {
    display: 'flex',
    color: '#999',
  },
  icon: {
    color: theme.palette.error.main,
    minWidth: '40px',
  },
}));

export default function UploadItem({ uploadOrFile, children, ...rest }) {
  const classes = useStyles();

  function makeIcon() {
    if (true) {
      return <Movie className={classes.icon} />;
    }
    return <Image className={classes.icon} />;
  }
  return (
    <>
      <ListItem>
        <Grid container alignItems="center">
          <Grid className={classes.gridTitle} item xs={12} md={9}>
            {makeIcon()}
            <Typography color="inherit">{children}</Typography>
          </Grid>
          <Grid xs={12} md={3} item>
            <Grid
              className={classes.gridTitle}
              direction="row"
              alignItems="center"
              justify="flex-end"
            >
              <UploadProgress size="48" uploadOrFile={uploadOrFile} />
              <UploadAction uploadOrFile={uploadOrFile} />
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
}
