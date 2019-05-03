import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render /*, find*/ } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | log in', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{log-in}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#log-in}}
        template block text
      {{/log-in}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
