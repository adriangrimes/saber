import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  // beforeModel() {
  //   // Remove all other users files from the store when loading a new users profile
  //   return this.store.unloadAll('user-public-file');
  // },

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

    // Set up gender selection inputs with loaded store data
    controller.set('tempSexText', '');
    if (model.userPublicDatum.get('profileSex') == 'Male') {
      controller.set('tempSexSelection', 'Male');
    } else if (model.userPublicDatum.get('profileSex') == 'Female') {
      controller.set('tempSexSelection', 'Female');
    } else if (model.userPublicDatum.get('profileSex') == 'Hide') {
      controller.set('tempSexSelection', 'Hide');
    } else {
      controller.set('tempSexSelection', 'Other');
      controller.set('tempSexText', model.userPublicDatum.get('profileSex'));
      controller.set('checkOtherSex', true);
    }

    // Set isStreaming
    // onlineStatus is currently used to determine whether the user is
    // streaming or not
    controller.set('isStreaming', model.userPublicDatum.get('onlineStatus'));

    // Set up user tags
    controller.set('tags', model.userPublicDatum.get('userCustomTags'));
  }
});
