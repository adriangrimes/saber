import Ember from 'ember';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import { pluralize } from 'ember-inflector';
const { String: { underscore } } = Ember;

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: 'http://localhost:3000',
  authorizer: 'authorizer:devise',
  headers: Ember.computed('session.authToken', function() {
    return {
      'Authorization':
        `Token token="${this.get('session.data.authenticated.token')}", email="${this.get('session.data.authenticated.email')}", login="${this.get('session.data.authenticated.login')}"`
    };
  }),

  pathForType(type) {
    return pluralize(underscore(type));
  }
});
