import React from 'react';
import { Switch, Route } from 'react-router-dom'
import routes from './index';

// import { Container } from './styles';

export default function AppRouter() {
  return (
    <Switch>
      {
        routes.map((route, key) => (
          <Route
            key={key}
            path={route.path}
            component={route.component}
            exact={route.exact === true}
          />
        ))
      }
    </Switch>
  );
}
