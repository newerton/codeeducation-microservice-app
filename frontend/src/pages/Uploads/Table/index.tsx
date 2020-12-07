import React from 'react';
import {
  makeStyles,
  Theme,
  Card,
  CardContent,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  Grid,
  List,
  Divider,
} from '@material-ui/core';
import UploadItem from './UploadItem';
import Page from '../../../components/Page';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import { UploadModule, Upload } from '../../../store/upload/types';
import { VideoFileFieldsMaps } from '../../../util/models';

const useStyles = makeStyles((theme: Theme) => {
  return {
    panelSummary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    expendedIcon: {
      color: theme.palette.primary.contrastText,
    },
  };
});

const Uploads = () => {
  const classes = useStyles();
  const uploads = useSelector<UploadModule, Upload[]>(
    (state) => state.upload.uploads,
  );

  return (
    <Page title="Uploads">
      {uploads.map((upload, key) => (
        <Card elevation={5} key={key}>
          <CardContent>
            <UploadItem uploadOrFile={upload}>{upload.video.title}</UploadItem>
            <ExpansionPanel style={{ margin: 0 }}>
              <ExpansionPanelSummary
                className={classes.panelSummary}
                expandIcon={<ExpandMoreIcon className={classes.expendedIcon} />}
              >
                <Typography>Ver detalhes</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ padding: '0px' }}>
                <Grid item xs={12}>
                  {upload.files.map((file, key) => (
                    <React.Fragment key={key}>
                      <List dense={true} style={{ padding: '0px' }}>
                        <Divider />
                        <UploadItem uploadOrFile={file}>
                          {`${VideoFileFieldsMaps[file.fileField]} - ${
                            file.filename
                          }`}
                        </UploadItem>
                      </List>
                    </React.Fragment>
                  ))}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </CardContent>
        </Card>
      ))}
    </Page>
  );
};

export default Uploads;
