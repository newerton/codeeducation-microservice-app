import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { InputAdornment, TextField } from '@material-ui/core';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

function InputFile({ name, values, setValues, ...rest }, ref) {
  const fileRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [filename, setFilename] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: fileRef.current,
      path: 'dataset.value',
    });
  }, [fileRef.current, fieldName]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue) setValues(defaultValue);
  }, [fieldName, defaultValue, setValues]);

  const inputFileProps = {
    ...rest.InputFileProps,
    hidden: true,
    ref: fileRef,
    'data-value': values,
    onChange(event) {
      const { files } = event.target;
      if (files.length) {
        setFilename(
          Array.from(files)
            .map(file => file.name)
            .join(', ')
        );
      }
      if (rest.InputFileProps && rest.InputFileProps.onChange) {
        rest.InputFileProps.onChange(event);
      }
    },
  };

  const textFieldProps = {
    variant: 'outlined',
    ...rest.TextFieldProps,
    InputProps: {
      ...(rest.TextFieldProps &&
        rest.TextFieldProps.InputProps && {
          ...rest.TextFieldProps.InputProps,
        }),
      readOnly: true,
      endAdornment: (
        <InputAdornment position="end">{rest.ButtonFile}</InputAdornment>
      ),
    },
    fullWidth: true,
    value: filename,
    error: error && true,
    helperText: error,
  };

  useImperativeHandle(ref, () => ({
    openWindow: () => fileRef.current.click(),
  }));

  return (
    <>
      <input id={fieldName} name={name} type="file" {...inputFileProps} />
      <TextField {...textFieldProps} />
    </>
  );
}

export default forwardRef(InputFile);

InputFile.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.string.isRequired,
  setValues: PropTypes.func.isRequired,
};
