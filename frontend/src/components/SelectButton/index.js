import React, { useEffect, useRef, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useField } from '@rocketseat/unform';
import PropTypes from 'prop-types';

export default function SelectButton({ name, label, list, multiple }) {
  const ref = useRef();
  const labelRef = useRef(0);
  const [labelWidth, setLabelWidth] = useState(0);
  const { fieldName, registerField, defaultValue, error } = useField(name);

  const initialValue = multiple ? [] : '';
  const [values, setValues] = useState(initialValue);

  const parseValue = inputRef => inputRef.dataset.value.split(',');
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

  return (
    <>
      <FormControl margin="normal" variant="outlined" fullWidth>
        <InputLabel ref={labelRef} id={`${fieldName}-select`}>{label}</InputLabel>
        <Select
          multiple={multiple}
          labelId={`${fieldName}-select`}
          id={fieldName}
          value={values}
          data-value={values}
          onChange={multiple ? handleChangeMultiple : handleChange}
          labelWidth={labelWidth}
          ref={ref}
        >
          <MenuItem disabled>
            <em>Selecione categorias</em>
          </MenuItem>
          {list &&
          list.map(item => (
            <MenuItem value={item.id} key={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

SelectButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
};

SelectButton.defaultProps = {
  multiple: false,
};
