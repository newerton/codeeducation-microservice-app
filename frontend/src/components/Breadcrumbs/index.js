import React from 'react';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import BreadcrumbsUi from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import RouteParser from 'route-parser';

import routes from '../../routes';

const breadcrumbNameMap = {};
routes.forEach(route => (breadcrumbNameMap[route.path] = route.label));

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  linkRouter: {
    color: '#4db5ab',
  },
}));

const LinkRouter = props => <Link {...props} component={RouterLink} />;

export default function Breadcrumbs() {
  const classes = useStyles();

  function makeBreadcrumb(location) {
    const pathnames = location.pathname.split('/').filter(x => x);
    pathnames.unshift('/');
    return (
      <BreadcrumbsUi aria-label="breadcrumb">
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `${pathnames
            .slice(0, index + 1)
            .join('/')
            .replace('//', '/')}`;
          const route = Object.keys(breadcrumbNameMap).find(path =>
            new RouteParser(path).match(to)
          );

          if (route === undefined) {
            return false;
          }
          return last ? (
            <Typography color="textPrimary" key={to}>
              {breadcrumbNameMap[route]}
            </Typography>
          ) : (
            <LinkRouter
              color="inherit"
              to={to}
              key={to}
              className={classes.linkRouter}
            >
              {breadcrumbNameMap[route]}
            </LinkRouter>
          );
        })}
      </BreadcrumbsUi>
    );
  }
  return (
    <div className={classes.root}>
      <Route>{({ location }) => makeBreadcrumb(location)}</Route>
    </div>
  );
}
