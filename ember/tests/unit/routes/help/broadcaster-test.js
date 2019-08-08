import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | help/broadcaster', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:help/broadcaster');
    assert.ok(route);
  });
});
