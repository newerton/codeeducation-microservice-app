import {bind, BindingScope, inject} from '@loopback/core';
import {getModelSchemaRef} from '@loopback/openapi-v3';
import {repository} from '@loopback/repository';
import {AjvFactory, RestBindings, validateRequestBody} from '@loopback/rest';
import {CategoryRepository} from '../repositories';

interface ValidateOptions<T> {
  data: object;
  entityClass: Function & {prototype: T};
}

@bind({scope: BindingScope.SINGLETON})
export class ValidatorService {
  cache = new Map();

  constructor(
    @repository(CategoryRepository) private repo: CategoryRepository,
    @inject(RestBindings.AJV_FACTORY) private ajvFactory: AjvFactory,
  ) {
    //super()
  }

  async validate<T extends object>({data, entityClass}: ValidateOptions<T>) {
    const modelSchema = getModelSchemaRef(entityClass);
    if (!modelSchema) {
      const error = new Error('The parameter entityClass is not a entity');
      error.name = 'NotEntityClass';
      throw error;
    }

    const schemaRef = {$ref: modelSchema.$ref};
    const schemaName = Object.keys(modelSchema.definitions)[0];

    // Cache Schema
    if (!this.cache.has(schemaName)) {
      this.cache.set(schemaName, modelSchema.definitions[schemaName]);
    }

    const globalSchemas = Array.from(this.cache).reduce<any>(
      (obj, [key, value]) => {
        obj[key] = value;
        return obj;
      },
      {},
    );

    console.log('globalSchemas', globalSchemas);

    await validateRequestBody(
      {value: data, schema: schemaRef},
      {required: true, content: {}},
      globalSchemas,
      {
        ajvFactory: this.ajvFactory,
      },
    );
  }
}
