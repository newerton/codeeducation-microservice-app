import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, Request, ResponseObject, RestBindings} from '@loopback/rest';
import {CategoryRepository} from '../repositories';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(CategoryRepository) private categoryRepo: CategoryRepository,
  ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack 3',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }

  @get('/create-category')
  async index() {
    let _id = Math.random().toString(36).substring(7);
    await this.categoryRepo.create({
      id: _id,
      name: 'My first category',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    return this.categoryRepo.find();
  }
}
