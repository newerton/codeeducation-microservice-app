import React, { Dispatch, SetStateAction } from 'react';

import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';

interface FormButtonsProps {
  loading?: boolean;
  handleSave: () => {};
  setFormType: Dispatch<SetStateAction<string>>;
}

const useStyles = makeStyles((theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
    circularProgress: {
      marginLeft: theme.spacing(1),
      position: 'relative',
      top: '12px',
    },
  };
});

const FormButtons: React.FC<FormButtonsProps> = ({ loading, handleSave, setFormType }) => {
  const classes = useStyles();
  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: loading,
  };
  const circularProgress = loading && (
    <CircularProgress size={26} className={classes.circularProgress} />
  );

  return (
    <Box>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => handleSave() && setFormType('save')}
      >
        Salvar
      </Button>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => handleSave() && setFormType('save-and-new')}
      >
        Salvar e adicionar um novo
      </Button>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => handleSave() && setFormType('save-and-edit')}
      >
        Salvar e continuar editando
      </Button>
      {circularProgress}
    </Box>
  );
};

export default FormButtons;
