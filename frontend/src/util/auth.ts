import Keycloak from 'keycloak-js';
import { AuthClientInitOptions } from '@react-keycloak/core';

const keyCloakCredentials = JSON.parse(process.env.REACT_APP_KEYCLOAK_JSON!);
const authServerUrl = keyCloakCredentials['auth-server-url'];
const realm = keyCloakCredentials['realm'];

export const keycloak = Keycloak({
  url: authServerUrl,
  realm,
  clientId: keyCloakCredentials['resource'],
});

export const keycloakConfig: AuthClientInitOptions = {
  onLoad: 'check-sso',
};

export const keycloakLinks = {
  accountConsole: `${authServerUrl.replace(/\/$/, '')}/realms/${realm}/account`,
  adminConsole: `${authServerUrl.replace(/\/$/, '')}/admin/${realm}/console`,
};
