import React, { useEffect, useRef, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  selectError: {
    color: '#f44336',
    margin: '8px 14px 0',
    fontSize: '0.75rem',
  },
}));

export default function SelectButton({
  name,
  label,
  list,
  multiple,
  loading,
}) {
  const classes = useStyles();
  const ref = useRef();
  const labelRef = useRef(0);
  const [labelWidth, setLabelWidth] = useState(0);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [values, setValues] = useState(defaultValue);

  const parseValue = inputRef =>
    inputRef.dataset.value ? inputRef.dataset.value.split(',') : [];
  const handleChange = () => setValues(values);
  const handleChangeMultiple = event => {
    const { value } = event.target;

    const options = [];
    if (!options[value]) {
      options.push(...value);
    }
    setValues(options);
  };

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: ref.current,
      path: 'dataset.value',
      parseValue,
    });
  }, [ref.current, fieldName]); // eslint-disable-line

  useEffect(() => {
    setLabelWidth(labelRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    if (defaultValue) setValues(defaultValue);
  }, [fieldName, defaultValue]);

  return (
    <>
      <FormControl
        margin="normal"
        variant="outlined"
        error={error && true}
        fullWidth
      >
        <InputLabel ref={labelRef} id={`${fieldName}-select`}>
          {label}
        </InputLabel>
        <Select
          multiple={multiple}
          labelId={`${fieldName}-select`}
          id={fieldName}
          value={values}
          data-value={values}
          onChange={multiple ? handleChangeMultiple : handleChange}
          labelWidth={labelWidth}
          ref={ref}
          disabled={loading}
        >
          {list &&
            list.map(item => (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </Select>
        {error && (
          <p className={classes.selectError} id="name-helper-text">
            {error}
          </p>
        )}
      </FormControl>
    </>
  );
}

SelectButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  loading: PropTypes.bool,
};

SelectButton.defaultProps = {
  multiple: false,
  loading: false,
};
