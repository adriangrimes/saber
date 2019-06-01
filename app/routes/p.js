
import Route from '@ember/routing/route';

export default Route.extend( {

  model(params) {
    return this.store.queryRecord('user-public-datum',
      { username: params.username });
  },

  setupController(controller, model) {
    // Sets profile view and edit panel input fields with loaded store data
    this._super(controller, model);
    // Set up gender selection inputs with loaded store data
    controller.set('tempSexText', '');
    if (model.get('profileSex') == 'Male') {
      controller.set('tempSexSelection', 'Male');
    } else if (model.get('profileSex') == 'Female') {
      controller.set('tempSexSelection', 'Female');
    } else {
      controller.set('tempSexSelection', 'Other');
      controller.set('tempSexText', model.get('profileSex'));
      controller.set('checkOtherSex', true);
    }
    // Set up user tags
    if (model.get('userCustomTags') != null) {
      controller.set('tags', model.get('userCustomTags').split(","));
    }
  }

});
