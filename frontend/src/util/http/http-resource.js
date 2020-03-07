import axios from 'axios';
import { objectToFormData } from 'object-to-formdata';

import http from './index';

export default class HttpResource {
  constructor(resource) {
    this.resource = resource;
    this.cancelList = null;
  }

  async list(options = {}) {
    if (this.cancelList) {
      this.cancelList.cancel('list request cancelled');
    }
    this.cancelList = axios.CancelToken.source();
    const config = {
      cancelToken: this.cancelList.token,
    };
    if (options && options.queryParams) {
      config.params = options.queryParams;
    }
    return http.get(this.resource, config);
  }

  async get(id, options = {}) {
    return http.get(`${this.resource}/${id}`, options);
  }

  async create(data) {
    const sendData = await this.makeSendData(data);
    return http.post(this.resource, sendData);
  }

  async update(id, data, options = {}) {
    let sendData = data;

    if (await this.containsFile(data)) {
      sendData = await this.getFormData(data);
    }
    const { request } = options;
    return !options || !request || !request.usePost
      ? http.put(`${this.resource}/${id}`, sendData)
      : http.post(`${this.resource}/${id}`, sendData);
  }

  async delete(id) {
    return http.delete(`${this.resource}/${id}`);
  }

  async deleteCollection(queryParams) {
    const config = {};
    if (queryParams) {
      config.params = queryParams;
    }
    return http.delete(this.resource, config);
  }

  async isCancelledRequest(error) {
    return axios.isCancel(error);
  }

  async makeSendData(data) {
    return this.containsFile(data) ? this.getFormData(data) : data;
  }

  async getFormData(data) {
    data.thumb_file = await this.base64toBlob(data.thumb_file);
    data.banner_file = await this.base64toBlob(data.banner_file);
    data.trailer_file = await this.base64toBlob(data.trailer_file);
    data.video_file = await this.base64toBlob(data.video_file);
    return objectToFormData(data, { booleansAsIntegers: true });
  }

  // eslint-disable-next-line class-methods-use-this
  async containsFile(data) {
    return Object.values(data).filter(el => /base64/g.test(el)).length !== 0;
  }

  // eslint-disable-next-line class-methods-use-this
  async isBase64(str) {
    return /base64/g.test(str);
  }

  // eslint-disable-next-line class-methods-use-this
  async base64toBlob(b64Data, sliceSize = 512) {
    const contentType = b64Data.split(';')[0].split(':')[1];
    const base64Data = b64Data.split(';')[1].replace('base64,', '');
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }
}
