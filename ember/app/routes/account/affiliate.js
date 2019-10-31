import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';
import ContractorApplicationValidations from '../../validations/contractor-application';

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
        })
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('applicationType', 'Affiliate');
    model.contractorApplication.set('electronicSignature', '');
    controller.set(
      'changeset',
      new Changeset(
        model.contractorApplication,
        lookupValidator(ContractorApplicationValidations),
        ContractorApplicationValidations
      )
    );
  },

  actions: {
    willTransition(transition) {
      if (this.get('controller.changeset.isDirty')) {
        if (
          !confirm(
            'You have unsaved changes. Are you sure you want to leave this page?'
          )
        ) {
          transition.abort();
        }
      }

      // Clears any unused created records
      this.controller.get('model.contractorApplication').rollbackAttributes();
      return true;
    }
  }
});
