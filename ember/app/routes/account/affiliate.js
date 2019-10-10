import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      user: this.store.findRecord(
        'user',
        this.get('session.data.authenticated.user_id')
      ),
      contractorApplication: this.store.query('contractor-application'),
      userVerificationUploads: this.store.query('user-verification-upload', {
        id: this.get('session.data.authenticated.user_id')
      })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    // Set account settings to settings pulled from db
    controller.set(
      'inputfullName',
      model.contractorApplication.get('fullName')
    );
    if (model.contractorApplication.get('birthdate') != null) {
      var bday = model.contractorApplication.get('birthdate').toString();
      var bdaystr = bday.split(' ');
      controller.set('inputMonth', bdaystr[1]);
      controller.set('inputDay', bdaystr[2]);
      controller.set('inputYear', bdaystr[3]);
    } else {
      controller.set('inputMonth', 'Month');
      controller.set('inputDay', 'Day');
      controller.set('inputYear', 'Year');
    }
    controller.set(
      'inputaddress1',
      model.contractorApplication.get('addressLine1')
    );
    controller.set(
      'inputaddress2',
      model.contractorApplication.get('addressLine2')
    );
    if (model.contractorApplication.get('addressLine3') != null) {
      var address3 = model.contractorApplication.get('addressLine3').split('|');
      controller.set('inputCity', address3[0]);
      controller.set('inputRegion', address3[1]);
      controller.set('inputZipcode', address3[2]);
      controller.set('inputCountry', address3[3]);
      if (address3[3] == 'United States') {
        controller.set('isUSA', true);
      }
    }
  }
});
