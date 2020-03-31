import React from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    width: '36px',
    height: '36px',
    fontSize: '0.75rem',
    color: '#fff',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const backgroundColors = {
  L: '#39B549',
  '10': '#20A3D4',
  '12': '#E79738',
  '14': '#E35E00',
  '16': '#D00003',
  '18': '#000000',
};

export default function Rating({ rating }) {
  const classes = useStyles();

  return (
    <>
      <Typography
        className={classes.root}
        style={{ backgroundColor: backgroundColors[rating] }}
      >
        {rating}
      </Typography>
    </>
  );
}

Rating.propTypes = {
  rating: PropTypes.string.isRequired,
};
