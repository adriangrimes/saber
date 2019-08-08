import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account/manage users', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:account/manage-users');
    assert.ok(route);
  });
});
