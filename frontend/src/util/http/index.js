import axios from 'axios';

const http = axios.create({
  baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL,
});
export default http;

const instances = [http];

export function addGlobalRequestInterceptor(onFulfilled, onRejected) {
  const ids = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const i of instances) {
    const id = i.interceptors.request.use(onFulfilled, onRejected);
    ids.push(id);
  }
  return ids;
}

export function removeGlobalRequestInterceptor(ids) {
  ids.forEach((id, index) => instances[index].interceptors.request.eject(id));
}

export function addGlobalResponseInterceptor(onFulfilled, onRejected) {
  const ids = [];
  /* eslint no-restricted-syntax:0 */
  for (const i of instances) {
    const id = i.interceptors.response.use(onFulfilled, onRejected);
    ids.push(id);
  }
  return ids;
}

export function removeGlobalResponseInterceptor(ids) {
  ids.forEach((id, index) => instances[index].interceptors.response.eject(id));
}
