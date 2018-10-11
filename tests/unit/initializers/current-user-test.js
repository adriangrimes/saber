import { run } from '@ember/runloop';
import Application from '@ember/application';
import LoginStateInitializer from 'sa/initializers/login-state';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | login state', {
  beforeEach() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  LoginStateInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
