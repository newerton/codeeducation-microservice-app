import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { makeStyles, Fade, IconButton, Divider } from '@material-ui/core';
import { CheckCircle, Error, Delete, Edit } from '@material-ui/icons';
import { useDebounce } from 'use-debounce/lib';

import { Creators } from '~/store/upload';
import { hasError, isFinished, isUploadType } from '~/store/upload/getters';

const useStyles = makeStyles(theme => ({
  successIcon: {
    color: theme.palette.success.main,
    marginLeft: theme.spacing(1),
  },
  errorIcon: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(1),
  },
  divider: {
    height: '20px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function UploadAction({ uploadOrFile }) {
  const videoId = uploadOrFile.video ? uploadOrFile.video.id : '';
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = hasError(uploadOrFile);
  const [show, setShow] = useState(false);
  const activeActions = isUploadType(uploadOrFile);
  const [debouncedShow] = useDebounce(show, 1500);

  useEffect(() => {
    setShow(isFinished(uploadOrFile));
  }, [uploadOrFile]);

  return debouncedShow ? (
    <Fade timeout={{ enter: 1000 }} in>
      <>
        {uploadOrFile.progress === 1 && !error && (
          <CheckCircle className={classes.successIcon} />
        )}
        {error && <Error className={classes.errorIcon} />}
        {activeActions && (
          <>
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              onClick={() => dispatch(Creators.removeUpload({ id: videoId }))}
            >
              <Delete color="primary" />
            </IconButton>
            <IconButton component={Link} to={`/videos/${videoId}/edit`}>
              <Edit color="primary" />
            </IconButton>
          </>
        )}
      </>
    </Fade>
  ) : null;
}
