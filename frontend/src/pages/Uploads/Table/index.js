import React from 'react';

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
  return (
    <Card elevation="5">
      <CardContent>
        <UploadItem>Video - Star Wars</UploadItem>
        <ExpansionPanel style={{ margin: 0 }}>
          <ExpansionPanelSummary
            className={classes.panelSummary}
            expandIcon={<ExpandMoreOutlined className={classes.expandedIcon} />}
          >
            <Typography>Ver detalhes</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ padding: 0 }}>
            <Grid item xs="12">
              <List style={{ padding: 0 }} dense>
                <Divider />
                <UploadItem>Principal - starwars.mp4</UploadItem>
              </List>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </CardContent>
    </Card>
  );
}
