import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('buy-credits', 'Integration | Component | buy credits', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{buy-credits}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#buy-credits}}
      template block text
    {{/buy-credits}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
