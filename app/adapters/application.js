import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const { String: { pluralize, underscore } } = Ember;

export default JSONAPIAdapter.extend({

  pathForType(type) {
    return pluralize(underscore(type));
  }

});

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: 'http://localhost:3000',
  authorizer: 'authorizer:devise'
});
