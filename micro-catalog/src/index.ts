import {ApplicationConfig} from '@loopback/core';
import {RestServer} from '@loopback/rest';
import {MicroCatalogApplication} from './application';
import './bootstrap';

export {MicroCatalogApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new MicroCatalogApplication(options);
  await app.boot();
  await app.start();

  const restServer = app.getSync<RestServer>('servers.RestServer');
  const url = restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
