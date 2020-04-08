import update from 'immutability-helper';
import { createActions, createReducer } from 'reduxsauce';

export const INITIAL_STATE = {
  uploads: [],
};

export const { Types, Creators } = createActions({
  addUpload: ['payload'],
  removeUpload: ['payload'],
  updateProgress: ['payload'],
  setUploadError: ['payload'],
});

function findIndexUpload(state, id) {
  return state.uploads.findIndex(upload => upload.video.id === id);
}

function findIndexFile(files, fileField) {
  return files.findIndex(file => file.fileField === fileField);
}

function findIndexUploadAndFile(state, videoId, fileField) {
  const indexUpload = findIndexUpload(state, videoId);
  if (indexUpload === -1) {
    return {};
  }

  const upload = state.uploads[indexUpload];
  const indexFile = findIndexFile(upload.files, fileField);
  return indexFile === -1 ? {} : { indexUpload, indexFile };
}

export function addUpload(state = INITIAL_STATE, action) {
  if (!action.payload.files.length) {
    return state;
  }
  const index = findIndexUpload(state, action.payload.video.id);
  if (index !== -1 && state.uploads[index].progress < 1) {
    return state;
  }

  const uploads =
    index === -1
      ? state.uploads
      : update(state.uploads, {
          $splide: [[index, 1]],
        });

  return {
    uploads: [
      ...uploads,
      {
        video: action.payload.video,
        progress: 0,
        files: action.payload.files.map(file => ({
          fileField: file.fileField,
          filename: file.file.name,
          progress: 0,
        })),
      },
    ],
  };
}

function removeUpload(state = INITIAL_STATE, action) {
  const uploads = state.uploads.filter(
    upload => upload.video.id !== action.payload.id
  );
  if (uploads.length === state.uploads.length) {
    return state;
  }
  return {
    uploads,
  };
}

function calculateGlobalProgress(files) {
  const countFiles = files.length;
  if (!countFiles) return 0;

  const sumProgress = files.reduce((sum, file) => sum + file.progress, 0);
  return sumProgress / countFiles;
}

function updateProgress(state = INITIAL_STATE, action) {
  const videoId = action.payload.video.id;
  const { fileField } = action.payload;
  const { indexUpload, indexFile } = findIndexUploadAndFile(
    state,
    videoId,
    fileField
  );
  if (typeof indexUpload === 'undefined') {
    return state;
  }
  const upload = state.uploads[indexUpload];
  const file = upload.files[indexFile];

  if (file.progress === action.payload.progress) {
    return state;
  }
  const uploads = update(state.uploads, {
    [indexUpload]: {
      $apply(upload) {
        const files = update(upload.files, {
          [indexFile]: {
            $set: { ...file, progress: action.payload.progress },
          },
        });
        const progress = calculateGlobalProgress(files);
        return { ...upload, progress, files };
      },
    },
  });

  return { uploads };
}

function setUploadError(state = INITIAL_STATE, action) {
  const videoId = action.payload.video.id;
  const { fileField } = action.payload;
  const { indexUpload, indexFile } = findIndexUploadAndFile(
    state,
    videoId,
    fileField
  );
  if (typeof indexUpload === 'undefined') {
    return state;
  }
  const upload = state.uploads[indexUpload];
  const file = upload.files[indexFile];
  const uploads = update(state.uploads, {
    [indexUpload]: {
      files: {
        [indexFile]: {
          $set: { ...file, error: action.payload.error, progress: 1 },
        },
      },
    },
  });

  return { uploads };
}

const reducer = createReducer(INITIAL_STATE, {
  [Types.ADD_UPLOAD]: addUpload,
  [Types.REMOVE_UPLOAD]: removeUpload,
  [Types.UPDATE_PROGRESS]: updateProgress,
  [Types.SET_UPLOAD_ERROR]: setUploadError,
});

export default reducer;
