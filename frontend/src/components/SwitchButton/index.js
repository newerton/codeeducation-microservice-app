import { FormControlLabel, Switch } from '@material-ui/core';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

export default function SwitchButton({ name, label, loading }) {
  const ref = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'dataset.value',
    });
  }, [fieldName, registerField]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue) setValues(defaultValue);
  }, [defaultValue]);

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            id={fieldName}
            name={fieldName}
            onChange={(e) => setValues(e.target.checked)}
            color="primary"
            ref={ref}
            data-value={values}
            checked={values}
            disabled={loading}
          />
        }
        label={label}
      />
      {error && <span>{error}</span>}
    </>
  );
}

SwitchButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

SwitchButton.defaultProps = {
  loading: false,
};
