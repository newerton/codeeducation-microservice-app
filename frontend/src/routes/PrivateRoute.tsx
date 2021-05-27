import React, { useCallback } from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import { useKeycloak } from '@react-keycloak/web';

interface PrivateProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateProps> = (props) => {
  const { component: Component, ...rest } = props;
  const { keycloak } = useKeycloak();
  const render = useCallback(
    (props) => {
      if (keycloak.authenticated) {
        return <Component {...props} />;
      }
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      );
    },
    [keycloak.authenticated],
  );

  return <Route {...rest} render={render} />;
};

export default PrivateRoute;
