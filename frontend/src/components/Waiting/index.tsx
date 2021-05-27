import React from 'react';
import { CircularProgress, Container, Typography } from '@material-ui/core';

interface WaitingPros {}

const Waiting: React.FC<WaitingPros> = () => {
  return (
    <Container>
      <CircularProgress />
      <Typography>Aguarde...</Typography>
    </Container>
  );
};

export default Waiting;
