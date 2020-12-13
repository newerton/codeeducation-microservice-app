import {ApplicationConfig} from '@loopback/core';
import {MicroCatalogApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const app = new MicroCatalogApplication(config);
  await app.boot();
  await app.start();
}

exportOpenApiSpec().catch((err) => {
  console.error('Fail to export OpenAPI spec from the application.', err);
  process.exit(1);
});
