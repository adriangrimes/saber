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

    // Set up gender selection inputs with loaded store data
    controller.set('tempGenderText', '');
    if (model.userPublicDatum.get('profileGender') == 'Male') {
      controller.set('tempGenderSelection', 'Male');
    } else if (model.userPublicDatum.get('profileGender') == 'Female') {
      controller.set('tempGenderSelection', 'Female');
    } else if (model.userPublicDatum.get('profileGender') == 'Hide') {
      controller.set('tempGenderSelection', 'Hide');
    } else {
      controller.set('tempGenderSelection', 'Other');
      controller.set('tempGenderText', model.userPublicDatum.get('profileGender'));
      controller.set('checkOtherGender', true);
    }

    // Set isStreaming
    // onlineStatus is currently used to determine whether the user is
    // streaming or not
    controller.set('isStreaming', model.userPublicDatum.get('onlineStatus'));

    // Set up user tags
    controller.set('tags', model.userPublicDatum.get('userCustomTags'));
  }
});
