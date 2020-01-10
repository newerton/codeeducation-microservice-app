import React, { useEffect, useRef, useState } from 'react';

import { TextField } from '@material-ui/core';
import { useField } from '@rocketseat/unform';
import PropTypes from 'prop-types';

export default function InputButton({ name, label, ...rest }) {
  const ref = useRef();
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);

  const handleChange = () => setValues(values);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'value',
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <TextField
        id={fieldName}
        label={label}
        variant="outlined"
        name={fieldName}
        onChange={handleChange}
        value={values}
        inputRef={ref}
        fullWidth
        error={error && true}
        helperText={error}
        {...rest}
      />
    </>
  );
}

InputButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
