import React from 'react';
import Navbar from './components/Navbar';
import {
  Box,
  MuiThemeProvider,
  CssBaseline,
  Container,
} from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';
import SnackBarProvider from './components/SnackBarProvider';
import Spinner from './components/Spinner';
import LoadingProvider from './components/Loading/LoadingProvider';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak, keycloakConfig } from './util/auth';

const App: React.FC = () => {
  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakConfig}>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackBarProvider>
            <CssBaseline />
            <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
              <Spinner />
              <Navbar />
              <Box paddingTop={'80px'}>
                <Breadcrumbs />
                <Container>
                  <AppRouter />
                </Container>
              </Box>
            </BrowserRouter>
          </SnackBarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </ReactKeycloakProvider>
  );
};

export default App;
