import React from 'react';

import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#f1f1f1',
      borderRadius: '4px',
      padding: theme.spacing(1, 1),
      color: theme.palette.secondary.main,
    },
  }),
);

const GridSelected: React.FC = ({ ...rest }) => {
  const classes = useStyles();
  return (
    <Grid container wrap="wrap" className={classes.root} {...rest}>
      {rest.children}
    </Grid>
  );
};

export default GridSelected;
