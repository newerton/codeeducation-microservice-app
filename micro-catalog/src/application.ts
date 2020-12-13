import {BootMixin} from '@loopback/boot';
import {Application, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestComponent, RestServer} from '@loopback/rest';
import {CrudRestComponent} from '@loopback/rest-crud';
import {RestExplorerBindings} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {
  EntityComponent,
  RestExplorerComponent,
  ValidatorsComponent,
} from './components';
import {MySequence} from './sequence';
import {RabbitmqServer} from './servers';

export {ApplicationConfig};

export class MicroCatalogApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(Application)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    options.rest.sequence = MySequence;

    this.component(RestComponent);
    const restServer = this.getSync<RestServer>('servers.RestServer');

    restServer.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(EntityComponent);
    this.component(ValidatorsComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.server(RabbitmqServer);
    this.component(CrudRestComponent);
  }

  async boot() {
    await super.boot();
    // const validator = this.getSync<ValidatorService>('services.ValidatorService');
    // try {
    //     await validator.validate({
    //         data: {},
    //         entityClass: Category
    //     });
    // } catch (e) {
    //     console.dir(e, {depth: 8});
    // }

    // try {
    //     await validator.validate({
    //         data: {},
    //         entityClass: Genre
    //     })
    // } catch (e) {
    //     console.dir(e, {depth: 8})
    // }
  }
}
