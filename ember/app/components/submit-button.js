import Component from '@ember/component';
import { later } from '@ember/runloop';

export default Component.extend({
  submitButtonDisabled: false,
  showButtonIcon: false,
  buttonIcon: 'small-loader',

  didReceiveAttrs() {
    this._super(...arguments);

    let submitStarted = this.submitStarted;
    let submitSuccessState = this.submitSuccessState;

    if (submitStarted) {
      this.set('showButtonIcon', true);
      this.set('submitButtonDisabled', true);
      if (submitSuccessState) {
        later(
          this,
          function() {
            this.set('buttonIcon', 'fa fa-check');
            later(
              this,
              function() {
                this.set('buttonIcon', 'small-loader');
              },
              1000
            );
          },
          200
        );
        later(
          this,
          function() {
            this.set('showButtonIcon', false);
            this.set('submitButtonDisabled', false);
            this.set('submitStarted', false);
            this.set('submitSuccessState', false);
          },
          1000
        );
      } else {
        later(
          this,
          function() {

            this.set('showButtonIcon', false);
            this.set('submitButtonDisabled', false);
            this.set('submitStarted', false);
            this.set('submitSuccessState', false);
          },
          1000
        );
      }
    } else {

      this.set('showButtonIcon', false);
      this.set('submitButtonDisabled', false);
      this.set('submitStarted', false);
      this.set('submitSuccessState', false);
    }
  }
});
