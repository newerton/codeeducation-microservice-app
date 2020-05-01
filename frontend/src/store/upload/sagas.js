/* eslint-disable no-restricted-syntax */
import { eventChannel, END } from 'redux-saga';
import { actionChannel, take, call, put } from 'redux-saga/effects';

import videoHttp from '~/util/http/video-http';

import { Types, Creators } from './index';

function sendUpload({ id, fileInfo }) {
  return eventChannel(emitter => {
    videoHttp
      .partialUpdate(
        id,
        {
          _method: 'PATCH',
          [fileInfo.fileField]: fileInfo.file,
        },
        {
          http: {
            usePost: true,
          },
          config: {
            headers: {
              ignoreLoading: true,
            },
            onUploadProgress(progressEvent) {
              if (progressEvent.lengthComputable) {
                const progress = progressEvent.loaded / progressEvent.total;
                emitter({ progress });
              }
            },
          },
        }
      )
      .then(response => emitter({ response }))
      .catch(error => emitter(error))
      .finally(() => emitter(END));
    const unsubscribe = () => {};
    return unsubscribe;
  });
}

function* uploadFile({ video, fileInfo }) {
  const channel = yield call(sendUpload, { id: video.id, fileInfo });
  while (true) {
    try {
      const { progress, response } = yield take(channel);
      if (response) {
        return response;
      }
      yield put(
        Creators.updateProgress({
          video,
          fileField: fileInfo.fileField,
          progress,
        })
      );
    } catch (e) {
      yield put(
        Creators.setUploadError({
          video,
          fileField: fileInfo.fileField,
          error: e,
        })
      );
      throw e;
    }
  }
}

export function* uploadWatcherSaga() {
  const newFilesChannel = actionChannel(Types.ADD_UPLOAD);
  while (true) {
    const { payload } = yield take(newFilesChannel);
    for (const fileInfo of payload.files) {
      try {
        const response = yield call(uploadFile, {
          video: payload.video,
          fileInfo,
        });
      } catch (e) {}
    }
  }
}
