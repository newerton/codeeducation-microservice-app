import React from 'react';
import { useSelector } from 'react-redux';

import {
  Card,
  CardContent,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Grid,
  List,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { ExpandMoreOutlined } from '@material-ui/icons';

import { VideoFileFieldsMap } from '~/util/models';

import UploadItem from './UploadItem';

const useStyles = makeStyles(theme => ({
  panelSummary: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  expandedIcon: {
    color: theme.palette.primary.contrastText,
  },
}));

export default function Table() {
  const classes = useStyles();

  const uploads = useSelector(state => state.upload.uploads);

  return (
    <>
      {uploads.map((upload, index) => (
        <Card elevation="5" key={index}>
          <CardContent>
            <UploadItem uploadOrFile={upload}>{upload.video.title}</UploadItem>
            <ExpansionPanel style={{ margin: 0 }}>
              <ExpansionPanelSummary
                className={classes.panelSummary}
                expandIcon={
                  <ExpandMoreOutlined className={classes.expandedIcon} />
                }
              >
                <Typography>Ver detalhes</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ padding: 0 }}>
                <Grid item xs="12">
                  <List style={{ padding: 0 }} dense>
                    {uploads.files.map((file, key) => (
                      <React.Fragment key={key}>
                        <Divider />
                        <UploadItem uploadOrFile={file}>
                          {`${VideoFileFieldsMap[file.fileField]} - ${
                            file.filename
                          }`}
                        </UploadItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
