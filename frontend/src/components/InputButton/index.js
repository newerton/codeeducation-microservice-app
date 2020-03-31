import React, { useEffect, useRef, useState } from 'react';

import { TextField } from '@material-ui/core';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

export default function InputButton({ name, label, loading, ...rest }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'dataset.value',
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue) setValues(defaultValue);
  }, [fieldName, defaultValue]);

  return (
    <>
      <TextField
        id={fieldName}
        label={label}
        variant="outlined"
        name={fieldName}
        onChange={e => setValues(e.target.value)}
        ref={ref}
        fullWidth
        error={error && true}
        helperText={error}
        value={values}
        data-value={values}
        disabled={loading}
        {...rest}
      />
    </>
  );
}

InputButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

InputButton.defaultProps = {
  loading: false,
};
