import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  // Override the default controller with the contractor-application controller
  controllerName: 'account/contractor-application',

  model() {
    return RSVP.hash({
      user: this.store.findRecord(
        'user',
        this.get('session.data.authenticated.user_id')
      ),
      contractorApplication: this.store
        .queryRecord('contractor-application', {}, { reload: true })
        .catch(err => {
          if (err.errors[0] && err.errors[0].status == 404) {
            console.log('creating new application');
            return this.store.createRecord('contractor-application', {});
          }
        }),
      userVerificationUploads: this.store.query('user-verification-upload', {
        id: this.get('session.data.authenticated.user_id')
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('applicationType', 'Broadcaster');

    // Parse birthdate string to fill in birthdate picker
    if (model.contractorApplication.get('birthdate')) {
      var birthdate = model.contractorApplication.get('birthdate');
      controller.set('inputMonth', controller.monthsList[birthdate.getMonth()]);
      controller.set('inputDay', birthdate.getDate().toString());
      controller.set('inputYear', birthdate.getFullYear().toString());
    }
  },

  actions: {
    willTransition(/*transition*/) {
      // Clears any unused created records
      this.controller.get('model.contractorApplication').rollbackAttributes();
      return true;
    }
  }
});
