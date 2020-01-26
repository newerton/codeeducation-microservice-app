import axios from 'axios';

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
    return http.post(this.resource, data);
  }

  async update(id, data) {
    return http.put(`${this.resource}/${id}`, data);
  }

  async delete(id) {
    return http.delete(`${this.resource}/${id}`);
  }

  async isCancelledRequest(error) {
    return axios.isCancel(error);
  }
}
