import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Fade, IconButton, Divider } from '@material-ui/core';
import { CheckCircle, Error, Delete, Edit } from '@material-ui/icons';

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

export default function UploadAction() {
  const classes = useStyles();
  return (
    <Fade timeout={{ enter: 1000 }} in>
      <>
        <CheckCircle className={classes.successIcon} />
        <Error className={classes.errorIcon} />
        <>
          <Divider className={classes.divider} orientation="vertical" />
          <IconButton>
            <Delete color="primary" />
          </IconButton>
          <IconButton component={Link} to="/videos/:uuid/edit">
            <Edit color="primary" />
          </IconButton>
        </>
      </>
    </Fade>
  );
}
