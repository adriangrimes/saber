import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | account/close', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:account/close');
    assert.ok(route);
  });
});
