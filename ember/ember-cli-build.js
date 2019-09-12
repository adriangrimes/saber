'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false
    },
    outputPaths: {
      app: {
        css: {
          default: '/assets/default.css',
          dark: '/assets/dark.css'
        }
      }
    },
    fingerprint: {
      enabled: EmberApp.env() === 'production', // - Boolean. Enables fingerprinting if true. True by default if current environment is production.
      generateAssetMap: true
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  // Bootstrap
  app.import('node_modules/bootstrap/scss/bootstrap.scss');
  // TODO import minified bootstrap for production
  app.import('node_modules/bootstrap/dist/js/bootstrap.js');

  // Plyr library
  app.import({
    development: 'node_modules/plyr/dist/plyr.js',
    test: 'node_modules/plyr/dist/plyr.js',
    staging: 'node_modules/plyr/dist/plyr.js',
    production: 'node_modules/plyr/dist/plyr.min.js'
  });
  app.import('node_modules/plyr/dist/plyr.css');
  // HLS.js for Plyr
  app.import({
    development: 'node_modules/hls.js/dist/hls.light.js',
    test: 'node_modules/hls.js/dist/hls.light.js',
    staging: 'node_modules/hls.js/dist/hls.light.js',
    production: 'node_modules/hls.js/dist/hls.light.min.js'
  });

  return app.toTree();
};
