import React, { useContext } from 'react';

import {
  Fade,
  LinearProgress as LP,
  MuiThemeProvider,
} from '@material-ui/core';

import LoadingContext from '~/components/Loading/LoadingContext';

function makeLocalTheme(theme) {
  return {
    ...theme,
    palette: {
      ...theme.palette,
      primary: theme.palette.error,
      type: 'dark',
    },
  };
}

export default function LinearProgress() {
  const loading = useContext(LoadingContext);
  return (
    <MuiThemeProvider theme={makeLocalTheme}>
      <Fade in={loading}>
        <LP
          color="primary"
          style={{ position: 'fixed', width: '100%', zIndex: 9999 }}
        />
      </Fade>
    </MuiThemeProvider>
  );
}
