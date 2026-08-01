import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import type React from 'react';

type PageProps = {
  title: string;
};

const useStyles = makeStyles({
  title: {
    color: '#999999',
  },
});

const Page: React.FC<PageProps> = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Container>
        <Typography className={classes.title} component="h1" variant="h5">
          {props.title}
        </Typography>
        <Box paddingTop={1}>{props.children}</Box>
      </Container>
    </div>
  );
};

export default Page;
