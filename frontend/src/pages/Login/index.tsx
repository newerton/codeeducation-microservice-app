import { useKeycloak } from '@react-keycloak/web';
import React from 'react';
import { Redirect, useLocation } from 'react-router';
import Waiting from '../../components/Waiting';

interface LoginProps {}

interface stateType {
  from: { pathname: string };
}

const Login: React.FC<LoginProps> = (props) => {
  const { keycloak } = useKeycloak();
  const location = useLocation<stateType>();

  const { from } = location.state || {
    from: { pathname: '/' },
  };

  if (keycloak!.authenticated) {
    return <Redirect to={from} />;
  }

  keycloak.login({
    redirectUri: `${window.location.origin}${process.env.REACT_APP_BASENAME}${from.pathname}`,
  });

  return <Waiting />;
};

export default Login;
