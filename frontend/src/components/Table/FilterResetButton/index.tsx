import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import type React from 'react';

const useStyles = makeStyles((theme) => ({
  iconButton: (theme as any).overrides.MUIDataTableTooblar.icon,
}));

interface FilterResetButtonProps {
  handleClick: () => void;
}

const FilterResetButton: React.FC<FilterResetButtonProps> = (props) => {
  const classes = useStyles();

  return (
    <Tooltip title="Limpar busca">
      <IconButton className={classes.iconButton} onClick={props.handleClick}>
        <ClearAllIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FilterResetButton;
