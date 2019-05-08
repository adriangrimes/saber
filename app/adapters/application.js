import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';
import config from '../config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  host: `${config.apiHost}`,
  identificationAttributeName: 'login',

  authorize(xhr) {
    let { email, token } = this.get('session.data.authenticated');
    let authData = `Token token="${token}", email="${email}"`;
    xhr.setRequestHeader('Authorization', authData);
  },

  pathForType(type) {
    return pluralize(underscore(type));
  }
});
