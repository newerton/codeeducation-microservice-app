import Keycloak from 'keycloak-js';
import { AuthClientInitOptions } from '@react-keycloak/core';

const keyCloakCredentials = JSON.parse(process.env.REACT_APP_KEYCLOAK_JSON!);

export const keycloak = Keycloak({
  url: keyCloakCredentials['auth-server-url'],
  realm: keyCloakCredentials['realm'],
  clientId: keyCloakCredentials['resource'],
});

export const keycloakConfig: AuthClientInitOptions = {
  onLoad: 'check-sso',
};
