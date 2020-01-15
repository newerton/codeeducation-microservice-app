import React from 'react';

import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  iconButton: theme.overrides.MUIDataTableToolbar.icon,
}));

export default function FilterResetButton({ handleClick }) {
  const classes = useStyles();

  return (
    <Tooltip title="Limpar busca">
      <IconButton className={classes.iconButton} onClick={handleClick}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
}

FilterResetButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
