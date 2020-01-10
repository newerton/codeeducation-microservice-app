import React, { useRef, useEffect, useState } from 'react';

import { Switch, FormControlLabel } from '@material-ui/core';
import { useField } from '@rocketseat/unform';
import PropTypes from 'prop-types';

export default function SwitchButton({ name, label, value }) {
  const ref = useRef(null);
  const { fieldName, registerField, error } = useField(name);
  const [checked, setChecked] = useState(value);

  const handleChange = () => setChecked(!checked);
  const parseValue = switchRef => Boolean(switchRef.value === 'true');

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'value',
      parseValue,
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            id={fieldName}
            name={fieldName}
            checked={checked}
            onChange={handleChange}
            color="primary"
            value={checked}
          />
        }
        inputRef={ref}
        label={label}
      />
      {error && <span>{error}</span>}
    </>
  );
}

SwitchButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
};
