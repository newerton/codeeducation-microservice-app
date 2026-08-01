import {
  Box,
  Container,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import type React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingProvider from './components/Loading/LoadingProvider';
import Navbar from './components/Navbar';
import SnackBarProvider from './components/SnackBarProvider';
import Spinner from './components/Spinner';
import AppRouter from './routes/AppRouter';
import theme from './theme';
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
