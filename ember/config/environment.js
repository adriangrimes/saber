'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'saber',
    environment,
    rootURL: '/',
    locationType: 'auto',
    moment: {
      // Options:
      // 'all' - all years, all timezones
      // '2010-2020' - 2010-2020, all timezones
      // 'none' - no data, just timezone API
      includeTimezone: 'all'
    },
    theme: {
      // Add themes for ember-theme-changer
      themes: ['default', 'dark'], // MANDATORY
      defaultTheme: 'default' // OPTIONAL
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['ember-simple-auth'] = {
    baseURL: 'index',
    authenticationRoute: 'index',
    routeAfterAuthentication: '/account',
    routeIfAlreadyAuthenticated: '/account'
  };

  if (environment === 'development') {
    ENV.apiHost = 'http://192.168.132.129:3000';
    ENV.chatServer = 'ws://192.168.132.129:7000';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.apiHost = 'http://192.168.132.147:3000';
    ENV.chatServer = 'ws://192.168.132.147:7000';
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'staging') {
    ENV.apiHost = 'https://api.saber.solversion.com';
    ENV.chatServer = 'wss://chat.saber.solversion.com';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'production') {
    ENV.apiHost = 'https://api.saber.tv';
    ENV.chatServer = 'wss://chat.saber.tv';
  }

  return ENV;
};
