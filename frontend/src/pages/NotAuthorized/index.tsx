import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
interface NotAuthorizedProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paragraph: {
      display: 'flex',
      margin: theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

const NotAuthorized: React.FC<NotAuthorizedProps> = () => {
  const classes = useStyles();

  return (
    <Box display="flex" flex="1" alignItems="center" justifyContent="center" flexDirection="column" style={{ height: '90vh' }}>
      <Box textAlign="center">
        <Typography variant="h4" component="h1">
          403 - Acesso não autorizado
        </Typography>
      </Box>

      <Box textAlign="center" className={classes.paragraph}>
        <Typography>
          Acesso o Codeflix pelo <Link to={'/'}>endereço</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default NotAuthorized;
