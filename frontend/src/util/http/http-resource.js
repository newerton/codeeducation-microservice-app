import http from './index';

export default class HttpResource {
  constructor(resource) {
    this.resource = resource;
  }

  async list(options = {}) {
    return http.get(this.resource, options);
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
}
