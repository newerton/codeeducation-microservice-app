import React from 'react';

import { TextField, Button, Switch, makeStyles } from '@material-ui/core';
import { Form as Formm, Input } from '@rocketseat/unform';
// import { Container } from './styles';

const useStyles = makeStyles(theme => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

export default function Form() {
  const classes = useStyles();
  const buttonProps = {
    className: classes.submit,
    variant: 'outlined',
  };

  function handleSubmit(data) {
    console.log(data);
  }
  return (
    <>
      <h1>Adicionar uma nova categoria</h1>
      <Formm onSubmit={handleSubmit}>
        <TextField
          label="Título"
          id="title"
          name="title"
          variant="outlined"
          InputProps={{
            inputComponent: Input,
          }}
          fullWidth
        />
        <TextField
          id="description"
          label="Descrição"
          multiline
          fullWidth
          rows="4"
          variant="outlined"
          margin="normal"
          InputProps={{
            inputComponent: Input,
          }}
        />
        <div>
          <Button {...buttonProps}>Salvar</Button>
          <Button {...buttonProps} type="submit">
            Salvar e continuar editando
          </Button>
        </div>
      </Formm>
    </>
  );
}
