import {
  Grid,
  ListItem,
  type Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import type React from 'react';
import UploadProgress from '../../../components/UploadProgress';
import type { FileUpload, Upload } from '../../../store/upload/types';
import UploadAction from './UploadAction';

const useStyles = makeStyles((theme: Theme) => {
  return {
    icon: {
      color: theme.palette.error.main,
      minWidth: '40px',
    },
    gridTitle: {
      display: 'flex',
      color: '#999999',
    },
  };
});

interface UploadItemProps {
  uploadOrFile: Upload | FileUpload;
}

const UploadItem: React.FC<UploadItemProps> = (props) => {
  const classes = useStyles();
  const { uploadOrFile } = props;

  function makeIcon() {
    if (true) {
      return <MovieIcon className={classes.icon} />;
    }
    return <ImageIcon className={classes.icon} />;
  }

  return (
    <ListItem>
      <Grid container alignItems="center">
        <Grid className={classes.gridTitle} item xs={12} md={9}>
          {makeIcon()}
          <Typography color="inherit">{props.children}</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="flex-end"
          >
            <UploadProgress size={48} uploadOrFile={uploadOrFile} />
            <UploadAction uploadOrFile={uploadOrFile} />
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default UploadItem;
