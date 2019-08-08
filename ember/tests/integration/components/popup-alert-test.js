import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render /*, find*/ } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | popup alert', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{popup-alert}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#popup-alert}}
        template block text
      {{/popup-alert}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
