import { IconButton, type Theme, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  SnackbarProvider as NotistackProvider,
  type SnackbarProviderProps,
} from 'notistack';
import type React from 'react';

const useStyles = makeStyles((theme: Theme) => {
  return {
    variantSuccess: {
      backgroundColor: theme.palette.success.main,
    },
    variantError: {
      backgroundColor: theme.palette.error.main,
    },
    variantInfo: {
      backgroundColor: theme.palette.primary.main,
    },
  };
});

const SnackBarProvider: React.FC<SnackbarProviderProps> = ({
  children,
  ...others
}) => {
  let snackbarProviderRef: any;
  const classes = useStyles();
  const defaultProps: any = {
    classes,
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    preventDuplicate: true,
    ref: (el) => (snackbarProviderRef = el),
    action: (key) => (
      <IconButton
        color="inherit"
        style={{ fontSize: 20 }}
        onClick={() => snackbarProviderRef.closeSnackbar(key)}
      >
        <CloseIcon />
      </IconButton>
    ),
  };

  const newProps = { ...defaultProps, ...others };

  return <NotistackProvider {...newProps}>{children}</NotistackProvider>;
};

export default SnackBarProvider;
