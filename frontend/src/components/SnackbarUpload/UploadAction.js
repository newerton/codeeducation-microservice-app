import React from 'react';

import { makeStyles, Fade, IconButton } from '@material-ui/core';
import { CheckCircle, Error, Delete } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  successIcon: {
    color: theme.palette.success.main,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
}));

export default function UploadAction({ ...rest }) {
  const classes = useStyles();
  const { size } = rest;
  return (
    <>
      <Fade timeout={{ enter: 1000 }} in>
        <div>
          <span>
            <IconButton className={classes.successIcon} edge="end">
              <CheckCircle />
            </IconButton>
            <IconButton className={classes.errorIcon} edge="end">
              <Error />
            </IconButton>
            <IconButton color="primary" edge="end">
              <Delete />
            </IconButton>
          </span>
        </div>
      </Fade>
    </>
  );
}
