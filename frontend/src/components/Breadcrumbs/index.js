import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import BreadcrumbsUi from '@material-ui/core/Breadcrumbs';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import routes from '../../routes';
import RouteParser from 'route-parser';

const breadcrumbNameMap = {};
routes.forEach(route => breadcrumbNameMap[route.path] = route.label);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  linkRouter: {
    color: "#4db5ab"
  }
}));

const LinkRouter = props => <Link {...props} component={RouterLink} />;

export default function Breadcrumbs() {
  const classes = useStyles();

  function makeBreadcrumb(location) {
    const pathnames = location.pathname.split('/').filter(x => x);
    pathnames.unshift('/');
    return (
      <BreadcrumbsUi aria-label="breadcrumb">
        {
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `${pathnames.slice(0, index + 1).join('/').replace('//', '/')}`;
            const route = Object.keys(breadcrumbNameMap).find(path => new RouteParser(path).match(to));

            if (route === undefined) {
              return false;
            }
            return last ? (
              <Typography color="textPrimary" key={to}>
                {breadcrumbNameMap[route]}
              </Typography>
            ) : (
                <LinkRouter color="inherit" to={to} key={to} className={classes.linkRouter}>
                  {breadcrumbNameMap[route]}
                </LinkRouter>
              );
          })
        }
      </BreadcrumbsUi>
    );
  }
  return (
    <div className={classes.root}>
      <Route>
        {
          ({ location }) => makeBreadcrumb(location)
        }
      </Route>
    </div>
  );
}
