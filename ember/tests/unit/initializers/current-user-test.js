import { run } from '@ember/runloop';
import Application from '@ember/application';
import currentUserInitializer from 'sa/initializers/current-user';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | current user', function(hooks) {
  hooks.beforeEach(function() {
    run(function() {
      application = Application.create();
      application.deferReadiness();
    });
  });

  // Replace this with your real tests.
  test('it works', function(assert) {
    currentUserInitializer.initialize(application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
