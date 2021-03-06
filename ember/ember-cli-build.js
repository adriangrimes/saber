'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    storeConfigInMeta: false,
    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    emberNotify: {
      importCss: false
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
      enabled: EmberApp.env() === 'production' || EmberApp.env() === 'staging', // - Boolean. Enables fingerprinting if true. True by default if current environment is production.
      generateAssetMap: true,
      exclude: ['apple-touch-icon', 'favicon', 'mstile', 'android-chrome']
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

  // Uppy.js for file uploads to Shrine attachment system on the back-end.
  // core
  // app.import('node_modules/@uppy/core/lib/index.js');
  // app.import('node_modules/@uppy/core/lib/index.js.map');
  app.import('node_modules/@uppy/core/dist/style.css');
  // // utils
  // app.import('node_modules/@uppy/utils/lib/Translator.js');
  // app.import('node_modules/@uppy/utils/lib/Translator.js.map');
  // // dashboard
  // app.import('node_modules/@uppy/dashboard/lib/index.js');
  // app.import('node_modules/@uppy/dashboard/lib/index.js.map');
  app.import('node_modules/@uppy/dashboard/dist/style.css');
  // // webcam
  // app.import('node_modules/@uppy/webcam/lib/index.js');
  // app.import('node_modules/@uppy/webcam/lib/index.js.map');
  app.import('node_modules/@uppy/webcam/dist/style.css');
  // // xhr-upload
  // app.import('node_modules/@uppy/xhr-upload/lib/index.js');
  // app.import('node_modules/@uppy/xhr-upload/lib/index.js.map');

  return app.toTree();
};
