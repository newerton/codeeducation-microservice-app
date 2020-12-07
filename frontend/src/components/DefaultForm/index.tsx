import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { GridProps } from '@material-ui/core/Grid';

interface DefaultFormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {
  GridItemProps?: GridProps;
  GridContainerProps?: GridProps;
}

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: theme.spacing(1, 0),
  },
}));

const DefaultForm: React.FC<DefaultFormProps> = (props) => {
  const classes = useStyles();

  const { GridItemProps, GridContainerProps, ...others } = props;
  return (
    <form {...others}>
      <Grid container {...GridContainerProps}>
        <Grid className={classes.gridItem} item {...GridItemProps}>
          {props.children}
        </Grid>
      </Grid>
    </form>
  );
};

export default DefaultForm;
