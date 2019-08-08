import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    if (params.reset_password_token) {
      this.set('resetPasswordToken', params.reset_password_token);
    }
  },

  setupController: function(controller) {
    controller.set('resetPasswordToken', this.get('resetPasswordToken'));
  }
});
