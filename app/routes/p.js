import Route from '@ember/routing/route';

export default Route.extend({


  //model(params) {
//    return this.get('store').findRecord('user', params.profile_id);
//  },
 setupController(controller,model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set('tipAmountOptions', 10);

  }
});
