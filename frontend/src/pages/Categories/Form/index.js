import React, { useState, useRef } from 'react';

import {
  TextField,
  Button,
  Switch,
  makeStyles,
  FormControlLabel,
} from '@material-ui/core';
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
  const inputRef = useRef(false);
  const buttonProps = {
    className: classes.submit,
    variant: 'outlined',
  };
  const [isActive, setIsActive] = useState();

  function handleSubmit(data) {
    console.log(data);
  }

  const handleIsActive = name => event => {
    setIsActive(!isActive);
  };
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
            inputProps: { inputRef: { ref: node => console.log('1', node) } },
          }}
          fullWidth
        />
        <TextField
          label="Descrição"
          id="description"
          name="description"
          multiline
          fullWidth
          rows="4"
          variant="outlined"
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={handleIsActive('is_active')}
              color="primary"
              id="is_active"
              name="is_active"
            />
          }
          label="Ativo"
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
