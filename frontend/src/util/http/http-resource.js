import http from "./index";

export default class HttpResource {
  constructor(resource) {
    this.resource = resource;
  }

  async list(options = {}) {
    return await http.get(this.resource, options);
  }
  async get(id, options = {}) {
    return await http.get(`${this.resource}/${id}`, options);
  }
  async create(data) {
    return await http.post(this.resource, data);
  }
  async update(id, data) {
    return await http.put(`${this.resource}/${id}`, data);
  }
  async delete(id) {
    return await http.delete(`${this.resource}/${id}`);
  }
}
