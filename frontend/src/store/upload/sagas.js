/* eslint-disable no-restricted-syntax */
import { actionChannel, take, call } from 'redux-saga/effects';

import videoHttp from '~/util/http/video-http';

import { Types } from './index';

function sendUpload({ id, fileInfo }) {
  return videoHttp.update(id, {
    [fileInfo.fileField]: fileInfo.file,
  });
}

function* uploadFile({ video, fileInfo }) {
  const event = yield call(sendUpload, { id: video.id, fileInfo });
}

export function* uploadWatcherSaga() {
  const newFilesChannel = actionChannel(Types.ADD_UPLOAD);
  while (true) {
    const { payload } = yield take(newFilesChannel);
    for (const fileInfo of payload.files) {
      yield call(
        uploadFile,
        { video: payload.video, fileInfo },
        {
          config: {
            onUploadProgress(progressEvent) {
              console.log(progressEvent);
            },
          },
        }
      );
    }
  }
}
