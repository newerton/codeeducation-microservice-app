import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import UploadProgress from './UploadProgress';
import UploadAction from './UploadAction';
import { Upload } from '../../store/upload/types';
import { hasError } from '../../store/upload/getters';

interface UploadItemProps {
  upload: Upload;
}

const useStyles = makeStyles((theme: Theme) => ({
  movieIcon: {
    color: theme.palette.error.main,
    minWidth: '40px',
  },
  listItem: {
    paddingTop: '7px',
    paddingBottom: '7px',
    height: '53px',
  },
  listItemText: {
    marginLeft: '6px',
    marginRight: '24px',
    color: theme.palette.text.secondary,
  },
}));

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const { upload } = props;
  const classes = useStyles();
  const error = hasError(upload);
  const [itemHover, setItemHover] = React.useState(false);

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={
          error
            ? 'Não foi possível fazer o upload, clique para mais detalhes'
            : ''
        }
        placement="left"
      >
        <ListItem
          button
          className={classes.listItem}
          onMouseOver={() => setItemHover(true)}
          onMouseLeave={() => setItemHover(false)}
        >
          <ListItemIcon className={classes.movieIcon}>
            <MovieIcon />
          </ListItemIcon>

          <ListItemText
            className={classes.listItemText}
            primary={
              <Typography noWrap={true} variant="subtitle2" color="primary">
                {upload.video.title}
              </Typography>
            }
          />
          {<UploadProgress size={30} uploadOrFile={upload} />}
          <UploadAction upload={upload} hover={itemHover} />
        </ListItem>
      </Tooltip>
      <Divider component="li" />
    </>
  );
};

export default UploadItem;
