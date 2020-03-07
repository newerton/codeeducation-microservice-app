import React from 'react';

import { makeStyles, CircularProgress, Fade } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  progressContainer: {
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
  progressBackground: {
    color: grey['300'],
  },
}));

export default function UploadProgress({ ...rest }) {
  const classes = useStyles();
  const { size } = rest;
  return (
    <>
      <Fade timeout={{ enter: 1000, exit: 2000 }} in>
        <div className={classes.progressContainer}>
          <CircularProgress
            variant="static"
            value="100"
            className={classes.progressBackground}
            size={size}
          />
          <CircularProgress
            variant="static"
            value="30"
            className={classes.progress}
            size={size}
          />
        </div>
      </Fade>
    </>
  );
}
