import React from 'react';

import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
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

export default function FormButtons({ isLoading, setFormType }) {
  const classes = useStyles();
  const buttonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: isLoading,
  };
  const circularProgress = isLoading && (
    <CircularProgress size={26} className={classes.circularProgress} />
  );

  return (
    <div>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => setFormType('save')}
      >
        Salvar
      </Button>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => setFormType('save-and-new')}
      >
        Salvar e adicionar um novo
      </Button>
      <Button
        {...buttonProps}
        type="submit"
        onClick={() => setFormType('save-and-edit')}
      >
        Salvar e continuar editando
      </Button>
      {circularProgress}
    </div>
  );
}

FormButtons.propTypes = {
  isLoading: PropTypes.bool,
  setFormType: PropTypes.func.isRequired,
};

FormButtons.defaultProps = {
  isLoading: false,
};
