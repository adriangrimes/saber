import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model(params) {
    return RSVP.hash({
      userPublicDatum: this.store.queryRecord('user-public-datum', {
        username: params.username
      }),
      userPublicUploads: this.store.query('user-public-upload', {
        username: params.username
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    // Set isStreaming
    // onlineStatus is currently used to determine whether the user is
    // streaming or not
    controller.set('isStreaming', model.userPublicDatum.get('onlineStatus'));

    // Set up user tags
    controller.set('tags', model.userPublicDatum.get('userCustomTags'));
  },

  actions: {
    willTransition(transition) {
      if (this.get('controller.model.userPublicDatum.hasDirtyAttributes')) {
        if (
          !confirm(
            'You have unsaved changes. Are you sure you want to leave this page?'
          )
        ) {
          transition.abort();
        } else {
          this.get('controller.model.userPublicDatum').rollbackAttributes();
        }
      }
      return true;
    }
  }
});
