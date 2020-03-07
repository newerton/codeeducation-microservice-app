import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function Delete(rest) {
  const { open, handleClose } = rest;
  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Exclusão de registros</DialogTitle>
      <DialogContent>
        <DialogContentText>Deseja realmente excluir este(s) registro(s)?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

Delete.defaultProps = {
  open: false,
  handleClose: () => {},
};
