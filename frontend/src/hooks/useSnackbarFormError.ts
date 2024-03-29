import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const useSnackbarFormError = (submitCount, errors) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const hasError = Object.keys(errors).length !== 0;
    if (submitCount > 0 && hasError) {
      enqueueSnackbar(
        'Formulário inválido. Reveja os campos marcados de vermelho!',
        { variant: 'error' },
      );
    }
  }, [submitCount, errors, enqueueSnackbar]);
};

export default useSnackbarFormError;
