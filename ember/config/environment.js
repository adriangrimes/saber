'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'saber',
    environment,
    rootURL: '/',
    locationType: 'auto',
    // 'ember-cli-babel': {
    //   includePolyfill: true
    // },
    moment: {
      // Options:
      // 'all' - all years, all timezones
      // '2010-2020' - 2010-2020, all timezones
      // 'none' - no data, just timezone API
      includeTimezone: 'all'
    },
    'ember-cli-lightbox': {
      lightboxOptions: {
        alwaysShowNavOnTouchDevices: false,
        albumLabel: 'Image %1 of %2',
        disableScrolling: true,
        fadeDuration: 0,
        fitImagesInViewport: true,
        // maxWidth: 300,
        // maxHeight: 300,
        positionFromTop: 50,
        resizeDuration: 0,
        showImageNumberLabel: true,
        wrapAround: true
      }
    },
    'ember-simple-auth': {
      baseURL: 'index',
      authenticationRoute: 'home',
      routeAfterAuthentication: 'home',
      routeIfAlreadyAuthenticated: 'home'
    },
    gReCaptcha: {
      jsUrl: 'https://www.google.com/recaptcha/api.js?render=explicit', // default
      siteKey: '6Ld7w64UAAAAAPzcvuA1hvB3xh1TMLyY8osoO7dW'
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

  if (environment === 'development') {
    ENV.apiHost = 'http://192.168.1.2:3000';
    ENV.chatServer = 'ws://192.168.1.2:7000';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.apiHost = 'http://192.168.1.2:3000';
    ENV.chatServer = 'ws://192.168.1.2:7000';
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
  }

  if (environment === 'production') {
    ENV.apiHost = 'https://api.saber.tv';
    ENV.chatServer = 'wss://chat.saber.tv';
  }

  return ENV;
};
