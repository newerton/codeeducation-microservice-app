/* eslint react/no-array-index-key:0 */
import React, { useEffect, useRef, useState } from 'react';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from '@rocketseat/unform';
import PropTypes from 'prop-types';

import Rating from '~/components/Rating';

const rating = [
  {
    value: 'L',
    control: <Radio color="primary" />,
    label: <Rating rating="L" />,
    labelPlacement: 'top',
  },
  {
    value: '10',
    control: <Radio color="primary" />,
    label: <Rating rating="10" />,
    labelPlacement: 'top',
  },
  {
    value: '12',
    control: <Radio color="primary" />,
    label: <Rating rating="12" />,
    labelPlacement: 'top',
  },
  {
    value: '14',
    control: <Radio color="primary" />,
    label: <Rating rating="14" />,
    labelPlacement: 'top',
  },
  {
    value: '16',
    control: <Radio color="primary" />,
    label: <Rating rating="16" />,
    labelPlacement: 'top',
  },
  {
    value: '18',
    control: <Radio color="primary" />,
    label: <Rating rating="18" />,
    labelPlacement: 'top',
  },
];

const useStyles = makeStyles(() => ({
  label: {
    marginBottom: '10px',
  },
  labelRating: {
    marginLeft: '0',
  },
  error: {
    color: '#f44336',
    margin: '8px 14px 0',
    fontSize: '0.75rem',
  },
}));

export default function RatingField({ name, isLoading }) {
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
  }, [ref.current, fieldName]); // eslint-disable-line

  useEffect(() => {
    if (defaultValue) setValues(defaultValue.toString());
  }, [fieldName, defaultValue]);

  return (
    <FormControl>
      <FormLabel component="legend" className={classes.label}>
        Classificação
      </FormLabel>
      <RadioGroup
        aria-label={fieldName}
        id={fieldName}
        name={fieldName}
        value={values}
        data-value={values}
        onChange={e => setValues(e.target.value)}
        ref={ref}
        row
      >
        {rating.map((props, key) => (
          <FormControlLabel
            key={key}
            disabled={isLoading}
            className={classes.labelRating}
            {...props}
          />
        ))}
      </RadioGroup>
      {error && (
        <p className={classes.error} id="name-helper-text">
          {error}
        </p>
      )}
    </FormControl>
  );
}

RatingField.propTypes = {
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

RatingField.defaultProps = {
  isLoading: false,
};
