import {Binding, Component, CoreBindings, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {RestTags} from '@loopback/rest';
import {ApplicationWithServices} from '@loopback/service-proxy';
import {ValidationError} from 'ajv';
import {difference} from 'lodash';

export class ValidatorsComponent implements Component {
  bindings: Array<Binding> = [];

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: ApplicationWithServices,
  ) {
    this.bindings = this.validators();
  }
  validators() {
    return [
      Binding.bind('ajv.keywords.exists')
        .to({
          name: 'exists',
          validate: async ([model, field]: Array<any>, value: any) => {
            const values = Array.isArray(value) ? value : [value];
            const repository = this.app.getSync<
              DefaultCrudRepository<any, any>
            >(`repositories.${model}Repository`);
            const rows = await repository.find({
              where: {
                or: values.map((v) => ({[field]: v})),
              },
            });
            if (rows.length !== values.length) {
              const valuesNotExists = difference(
                values,
                rows.map((r) => r[field]),
              );
              const errors = valuesNotExists.map((v) => ({
                message: `The valuie ${v} for ${model} not exists`,
              }));
              throw new ValidationError(errors as any);
            }
            return true;
          },
          async: true,
        })
        .tag(RestTags.AJV_KEYWORD),
    ];
  }
}
