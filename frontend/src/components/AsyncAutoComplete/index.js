import React, { useEffect, useState } from 'react';

import { CircularProgress, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useDebounce } from 'use-debounce';

export default function AsyncAutoComplete({ ...rest }) {
  const { TextFieldProps, AutocompleteProps, debounceTime = 300 } = rest;
  const {
    freeSolo = false,
    onOpen,
    onClose,
    onInputChange,
  } = AutocompleteProps;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);

  const textFieldProps = {
    margin: 'normal',
    variant: 'outlined',
    fullWidth: true,
    ...(TextFieldProps && { ...TextFieldProps }),
  };

  const autoCompleteProps = {
    loadingText: 'Carregando...',
    noOptionsText: 'Nenhum item encontrado',
    ...(AutocompleteProps && { ...AutocompleteProps }),
    open,
    options,
    loading,
    onOpen() {
      setOpen(true);
      onOpen && onOpen();
    },
    onClose() {
      setOpen(false);
      onClose && onClose();
    },
    onInputChange(event, value) {
      setSearchText(value);
      onInputChange && onInputChange();
    },
    renderInput: params => {
      return (
        <TextField
          {...params}
          {...textFieldProps}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      );
    },
  };

  useEffect(() => {
    if (!open && !freeSolo) {
      setOptions([]);
    }
  }, [freeSolo, open]);

  useEffect(() => {
    if (!open || (debouncedSearchText === '' && freeSolo)) {
      return;
    }
    let isSubscribed = true;

    async function loadData() {
      setLoading(true);
      const data = await rest.fetchOptions(debouncedSearchText);
      if (isSubscribed) {
        setOptions(data);
        setLoading(false);
      }
    }

    loadData();
    return () => {
      isSubscribed = false;
    };
  }, [freeSolo ? debouncedSearchText : open]); // eslint-disable-line

  return <Autocomplete {...autoCompleteProps} />;
}
