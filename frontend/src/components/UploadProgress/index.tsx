import React from 'react';
import { makeStyles, Theme, CircularProgress, Fade } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Upload, FileUpload } from '../../store/upload/types';
import { hasError } from '../../store/upload/getters';

interface UploadProgressProps {
  size: number;
  uploadOrFile: Upload | FileUpload;
}

const useStyles = makeStyles((theme: Theme) => ({
  progressContainer: {
    position: 'relative',
  },
  progressBackground: {
    color: grey['300'],
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
}));

const UploadProgress: React.FC<UploadProgressProps> = (props) => {
  const classes = useStyles();
  const { size, uploadOrFile } = props;
  const error = hasError(uploadOrFile);

  return (
    <Fade in={uploadOrFile.progress < 1} timeout={{ enter: 2000, exit: 2000 }}>
      <div className={classes.progressContainer}>
        <CircularProgress
          variant="static"
          value={100}
          className={classes.progressBackground}
          size={size}
        />
        <CircularProgress
          variant="static"
          value={error ? 0 : uploadOrFile.progress * 100}
          className={classes.progress}
          size={size}
        />
      </div>
    </Fade>
  );
};

export default UploadProgress;
