import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from '@unform/core';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles(() => ({
  radioGroupError: {
    color: '#f44336',
    margin: '8px 14px 0',
    fontSize: '0.75rem',
  },
}));

export default function RadioButton({ name, label, list, loading }) {
  const classes = useStyles();
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
    if (defaultValue) setValues(defaultValue.toString());
  }, [defaultValue]);

  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        aria-label={fieldName}
        id={fieldName}
        name={fieldName}
        value={values}
        data-value={values}
        onChange={(e) => setValues(e.target.value)}
        ref={ref}
      >
        {list &&
          Object.keys(list).map((key) => (
            <FormControlLabel
              key={key}
              value={key}
              control={<Radio />}
              label={list[key]}
              disabled={loading}
            />
          ))}
      </RadioGroup>
      {error && (
        <p className={classes.radioGroupError} id="name-helper-text">
          {error}
        </p>
      )}
    </FormControl>
  );
}

RadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.shape({}).isRequired,
  loading: PropTypes.bool,
};

RadioButton.defaultProps = {
  loading: false,
};
