import { Box, Container } from '@material-ui/core';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link, { type LinkProps } from '@material-ui/core/Link';
import { type Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import type { Location } from 'history';
import { Route } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import RouteParser from 'route-parser';
import { useHasRealmRole } from '../../hooks/useHasRealmRole';
import routes from '../../routes';

const breadcrumbNameMap: { [key: string]: string } = {};
routes.forEach(
  (route) => (breadcrumbNameMap[route.path as string] = route.label),
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    routerLink: {
      color: theme.palette.secondary.main,
      '&:focus, &:active': {
        color: theme.palette.secondary.main,
      },
      '&:hover': {
        color: theme.palette.secondary.dark,
      },
    },
  }),
);

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

export default function Breadcrumbs() {
  const classes = useStyles();
  const hasCatalogAdmin = useHasRealmRole('catalog-admin');

  if (!hasCatalogAdmin) {
    return null;
  }

  function makeBreadcrumbs(location: Location) {
    const pathnames = location.pathname.split('/').filter((x) => x);
    pathnames.unshift('/');
    return (
      <MuiBreadcrumbs aria-label="breadcrumb">
        {pathnames.map((_value, index) => {
          const last = index === pathnames.length - 1;
          const to = `${pathnames
            .slice(0, index + 1)
            .join('/')
            .replace('//', '/')}`;
          const route = Object.keys(breadcrumbNameMap).find((path) =>
            new RouteParser(path).match(to),
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
              className={classes.routerLink}
            >
              {breadcrumbNameMap[route]}
            </LinkRouter>
          );
        })}
      </MuiBreadcrumbs>
    );
  }

  return (
    <Container>
      <Box paddingTop={2} paddingBottom={1}>
        <Route>
          {({ location }: { location: Location }) => makeBreadcrumbs(location)}
        </Route>
      </Box>
    </Container>
  );
}
