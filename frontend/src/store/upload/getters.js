export function isUploadType(obj) {
  return 'video' in obj;
}

export function hasError(obj) {
  if (isUploadType(obj)) {
    const upload = obj;
    return upload.files.some(file => file.error);
  }
  const file = obj;
  return file.error !== undefined;
}

export function isFinished(obj) {
  return obj.progress === 1 || hasError(obj);
}

export function countInProgress(uploads) {
  return uploads.filter(upload => !isFinished(upload)).length;
}
