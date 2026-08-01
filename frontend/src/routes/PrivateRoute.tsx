import type React from 'react';
import { useCallback } from 'react';
import {
  Redirect,
  Route,
  type RouteComponentProps,
  type RouteProps,
} from 'react-router';
import { useHasRealmRole } from '../hooks/useHasRealmRole';
import NotAuthorized from '../pages/NotAuthorized';

interface PrivateProps extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateProps> = (props) => {
  const { component: Component, ...rest } = props;
  const hasCatalogAdmin = useHasRealmRole('catalog-admin');

  const render = useCallback(
    (props) => {
      if (hasCatalogAdmin) {
        return hasCatalogAdmin ? <Component {...props} /> : <NotAuthorized />;
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
    [hasCatalogAdmin, Component],
  );

  return <Route {...rest} render={render} />;
};

export default PrivateRoute;
