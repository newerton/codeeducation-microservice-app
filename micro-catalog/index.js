const application = require('./dist');
const config = require('./config');

module.exports = application;

if (require.main === module) {
  // Run the application
  application.main(config).catch((err) => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
