import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render /*, find*/ } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | buy credits', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{buy-credits}}`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#buy-credits}}
        template block text
      {{/buy-credits}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
