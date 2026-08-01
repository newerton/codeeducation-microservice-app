import { CircularProgress } from '@material-ui/core';
import TextField, { type TextFieldProps } from '@material-ui/core/TextField';
import {
  Autocomplete,
  type AutocompleteProps,
  type UseAutocompleteProps,
} from '@material-ui/lab';
import {
  type RefAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocompleteProps
  extends RefAttributes<AsyncAutocompleteComponent> {
  fetchOptions: (searchText) => Promise<any>;
  debounceTime?: number;
  TextFieldProps?: TextFieldProps;
  AutocompleteProps?: Omit<
    AutocompleteProps<any, any, any, any>,
    'renderInput' | 'options'
  > &
    Omit<UseAutocompleteProps<any, any, any, any>, 'renderInput' | 'options'>;
}

export interface AsyncAutocompleteComponent {
  clear: () => void;
}

const AsyncAutocomplete = forwardRef<
  AsyncAutocompleteComponent,
  AsyncAutocompleteProps
>((props, ref) => {
  const { AutocompleteProps, debounceTime = 300, fetchOptions } = props;
  const { freeSolo, onOpen, onClose, onInputChange } = AutocompleteProps as any;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const textFieldProps: TextFieldProps = {
    margin: 'normal',
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: { shrink: true },
    ...(props.TextFieldProps && { ...props.TextFieldProps }),
  };

  const autocompleteProps: AutocompleteProps<any, any, any, any> = {
    loadingText: 'Carregando...',
    noOptionsText: 'Nenhum item encontrado',
    ...(AutocompleteProps && { ...AutocompleteProps }),
    open,
    options,
    loading: loading,
    inputValue: searchText,
    onOpen() {
      setOpen(true);
      onOpen?.();
    },
    onClose() {
      setOpen(false);
      onClose?.();
    },
    onInputChange(_event, value) {
      setSearchText(value);
      onInputChange?.();
    },
    renderInput: (params) => (
      <TextField
        {...params}
        {...textFieldProps}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress color="inherit" size={20} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    ),
  };

  useEffect(() => {
    if (!open && !freeSolo) {
      setOptions([]);
    }
  }, [open, freeSolo]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (debouncedSearchText === '' && freeSolo) {
      return;
    }

    let isSubscribed = true;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchOptions(debouncedSearchText);
        if (isSubscribed) {
          setOptions(data);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      isSubscribed = false;
    };
  }, [freeSolo, debouncedSearchText, open, fetchOptions]);

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSearchText('');
      setOptions([]);
    },
  }));

  return <Autocomplete {...autocompleteProps} />;
});

export default AsyncAutocomplete;
