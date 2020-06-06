import React from 'react';

import { makeStyles, CircularProgress, Fade } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

import { hasError } from '~/store/upload/getters';

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

export default function UploadProgress({ uploadOrFile, ...rest }) {
  const classes = useStyles();
  const { size } = rest;
  const error = hasError(uploadOrFile);

  return (
    <>
      <Fade
        in={uploadOrFile.progress < 1}
        timeout={{ enter: 1000, exit: 2000 }}
      >
        <div className={classes.progressContainer}>
          <CircularProgress
            variant="static"
            value="100"
            className={classes.progressBackground}
            size={size}
          />
          <CircularProgress
            variant="static"
            value={error ? 0 : uploadOrFile.progress * 100}
            className={classes.progress}
            size={size}
          />
        </div>
      </Fade>
    </>
  );
}
