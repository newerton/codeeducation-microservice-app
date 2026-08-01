import { Box, CircularProgress, Typography } from '@material-ui/core';
import type React from 'react';

type WaitingPros = {};

const Waiting: React.FC<WaitingPros> = () => {
  return (
    <Box
      display="flex"
      flex="1"
      alignItems="center"
      justifyContent="center"
      style={{ height: '90vh' }}
    >
      <Box mr={2}>
        <CircularProgress />
      </Box>
      <Typography>Aguarde...</Typography>
    </Box>
  );
};

export default Waiting;
