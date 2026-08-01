import { Grid, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import type React from 'react';
import type { MouseEventHandler } from 'react';

interface GridSelectedItemProps {
  onDelete: MouseEventHandler<any>;
  children?: React.ReactNode;
  xs: any;
}

const GridSelectedItem: React.FC<GridSelectedItemProps> = ({
  onDelete,
  children,
  ...rest
}) => {
  return (
    <Grid item {...rest}>
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
};

export default GridSelectedItem;
