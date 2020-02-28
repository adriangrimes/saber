import Route from '@ember/routing/route';
import config from '../config/environment';

export default Route.extend({
  beforeModel() {
    this._super(...arguments);
    // Create a request variable and assign a new XMLHttpRequest object to it.

    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      // Open a new connection, using the GET request on the URL endpoint
      request.open(
        'GET',
        config.apiHost +
          '/management?id=' +
          this.get('session.data.authenticated.user_id'),
        true
      );
      let { email, token } = this.get('session.data.authenticated');
      let authData = `Token token="${token}", email="${email}"`;
      request.setRequestHeader('Authorization', authData);

      request.onload = () => {
        console.log(request.status);
        if (request.status != 200) {
          this.replaceWith('home');
          reject();
        } else {
          resolve();
        }
      };

      request.onerror = () => {
        reject();
      };

      // Send request
      request.send();
    });
  },

  model() {
    console.log('getting management model');
  }
});
