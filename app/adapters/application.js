import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: 'http://localhost:3000',
  authorizer: 'authorizer:devise',
  headers: computed('session.authToken', function() {
    return {
      'Authorization':
        `Token token="${this.get('session.data.authenticated.token')}", email="${this.get('session.data.authenticated.email')}", login="${this.get('session.data.authenticated.login')}"`
    };
  }),

  pathForType(type) {
    return pluralize(underscore(type));
  }
});
