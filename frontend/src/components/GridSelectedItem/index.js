import React from 'react';

import { Grid, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function GridSelectedItem({ ...rest }) {
  const { onDelete, children, ...other } = rest;
  return (
    <Grid item {...other}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={1} md={1}>
          <IconButton size="small" color="inherit" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
        <Grid item xs={11} md={11}>
          {children}
        </Grid>
      </Grid>
    </Grid>
  );
}
