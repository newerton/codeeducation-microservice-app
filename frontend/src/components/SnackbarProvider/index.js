import React, { useRef } from 'react';

import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { SnackbarProvider as NotistackProvider } from 'notistack';

export default function SnackbarProvider({ children, rest }) {
  const snackbarProviderRef = useRef();
  const defaultProps = {
    autoHideDuration: 3000,
    maxSnack: 3,
    anchorOrigin: {
      horizontal: 'right',
      vertical: 'top',
    },
    ref: snackbarProviderRef,
    action: key => (
      <IconButton
        color="inherit"
        style={{ fontSize: 20 }}
        onClick={() => snackbarProviderRef.current.closeSnackbar(key)}
      >
        <Close />
      </IconButton>
    ),
  };

  const newsProps = { ...defaultProps, ...rest };

  return <NotistackProvider {...newsProps}>{children}</NotistackProvider>;
}
