import Component from '@ember/component';
import { later } from '@ember/runloop';

export default Component.extend({
  submitButtonClass: 'btn btn-primary',
  submitButtonText: 'Save',
  submitButtonIcon: '',
  isDisabled: false,

  didReceiveAttrs() {
    this._super(...arguments);

    let submitStarted = this.submitStarted;
    let submitSuccessState = this.submitSuccessState;

    if (submitStarted) {
      this.set('submitButtonText', '');
      this.set('submitButtonIcon', 'small-loader');
      this.set('submitButtonClass', 'btn btn-primary disabled');
      this.set('isDisabled', true);
      if (submitSuccessState) {
        later(
          this,
          function() {
            this.set('submitButtonIcon', 'fa fa-check');
          },
          200
        );
        later(
          this,
          function() {
            this.set('submitButtonText', 'Save');
            this.set('submitButtonIcon', '');
            this.set('submitButtonClass', 'btn btn-primary');
            this.set('isDisabled', false);
            this.set('submitStarted', false);
            this.set('submitSuccessState', false);
          },
          1000
        );
      } else {
        later(
          this,
          function() {
            this.set('submitButtonText', 'Save');
            this.set('submitButtonIcon', '');
            this.set('submitButtonClass', 'btn btn-primary');
            this.set('isDisabled', false);
            this.set('submitStarted', false);
            this.set('submitSuccessState', false);
          },
          1000
        );
      }
    } else {
      this.set('submitButtonText', 'Save');
      this.set('submitButtonIcon', '');
      this.set('submitButtonClass', 'btn btn-primary');
      this.set('isDisabled', false);
      this.set('submitStarted', false);
      this.set('submitSuccessState', false);
    }
  }
});
