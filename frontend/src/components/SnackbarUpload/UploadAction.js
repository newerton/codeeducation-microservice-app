import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { makeStyles, Fade, IconButton } from '@material-ui/core';
import { CheckCircle, Error, Delete } from '@material-ui/icons';
import { useDebounce } from 'use-debounce/lib';

import { Creators } from '~/store/upload';
import { hasError, isFinished } from '~/store/upload/getters';

const useStyles = makeStyles(theme => ({
  successIcon: {
    color: theme.palette.success.main,
  },
  errorIcon: {
    color: theme.palette.error.main,
  },
}));

export default function UploadAction({ upload, hover, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = hasError(upload);
  const [show, setShow] = useState(false);
  const [debouncedShow] = useDebounce(show, 1500);

  useEffect(() => {
    setShow(isFinished(upload));
  }, [upload]);

  return debouncedShow ? (
    <>
      <Fade timeout={{ enter: 1000 }} in={show}>
        <div>
          <span hidden={hover}>
            {upload.progress === 1 && !error && (
              <IconButton className={classes.successIcon} edge="end">
                <CheckCircle />
              </IconButton>
            )}
            {error && (
              <IconButton className={classes.errorIcon} edge="end">
                <Error />
              </IconButton>
            )}
          </span>
          <span hidden={!hover}>
            <IconButton
              color="primary"
              edge="end"
              onClick={() =>
                dispatch(Creators.removeUpload({ id: upload.video.id }))
              }
            >
              <Delete />
            </IconButton>
          </span>
        </div>
      </Fade>
    </>
  ) : null;
}
