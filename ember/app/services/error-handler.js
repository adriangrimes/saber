import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  notify: service(),

  // init() {
  //   this._super(...arguments);
  // },

  handleWithNotification(err) {
    console.error('error handler service called with:', err);
    if (
      err instanceof TypeError &&
      err.message.includes('Network request failed')
    ) {
      this.get('notify').error(
        "The Saber server appears to be unavailable. We're working to make sure it's back as soon as possible!<br>Please try again later."
      );
    }
    if (err && err.errors) {
      if (err.errors[0].status || err.errors[0].status === 0) {
        let status = err.errors[0].status;
        if (status == 0) {
          this.get('notify').error(
            "The Saber server appears to be unavailable. We're working to make sure it's back as soon as possible!<br>Please try again later.",
            { id: 'server-unavailable' }
          );
        }
        if (status == 500) {
          this.get('notify').error(
            'The server encountered an internal error.<br>Please try again later.',
            { id: 'internal-server-error' }
          );
        }
        if (status == 404) {
          this.get('notify').error(
            "This item doesn't seem to exist anymore. You may need to refresh the page."
          );
        }
      } else {
        if (err.errors.length == 1) {
          if (err.errors[0].message) {
            this.notify.error(err.errors[0].message);
          } else {
            this.notify.error(
              'Sorry, the request is invalid. You may need to check for errors or try again later.',
              { id: 'invalid-request' }
            );
          }
        } else {
          this.notify.error({ textArray: err.errors });
        }
      }
    }
  }
});
