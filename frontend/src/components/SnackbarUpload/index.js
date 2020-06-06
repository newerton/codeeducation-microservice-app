import React, { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  Typography,
  IconButton,
  CardActions,
  Collapse,
  makeStyles,
  List,
} from '@material-ui/core';
import { Close, ExpandMore, ExpandLess } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import { countInProgress } from '~/store/upload/getters';

import UploadItem from './UploadItem';

const useStyles = makeStyles(theme => ({
  card: {
    width: 450,
  },
  cardActionRoot: {
    padding: '8px 8px 8px 16px',
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText,
  },
  icons: {
    marginLeft: 'auto !important',
    color: theme.palette.primary.contrastText,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

function SnackbarUpload({ ...props }, ref) {
  const { id } = props;
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(true);

  const uploads = useSelector(state => state.upload.uploads);

  const totalInProgress = countInProgress(uploads);

  function handleCollapse() {
    setExpanded(!expanded);
  }
  return (
    <Card ref={ref} className={classes.card}>
      <CardActions classes={{ root: classes.cardActionRoot }}>
        <Typography variant="subtitle2" className={classes.title}>
          Fazendo upload de {totalInProgress} vídeo(s)
        </Typography>
        <div className={classes.icons}>
          <IconButton color="inherit" onClick={handleCollapse}>
            {expanded ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
          <IconButton color="inherit" onClick={() => closeSnackbar(id)}>
            <Close />
          </IconButton>
        </div>
      </CardActions>
      <Collapse in={expanded}>
        <List className={classes.list}>
          {uploads.map((upload, key) => (
            <UploadItem key={key} upload={upload} />
          ))}
        </List>
      </Collapse>
    </Card>
  );
}

SnackbarUpload.propTtypes = {
  ref: PropTypes.object,
  props: PropTypes.object,
};

export default forwardRef(SnackbarUpload);
