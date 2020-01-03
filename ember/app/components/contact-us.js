import Component from '@ember/component';
import jQuery from 'jquery';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default Component.extend({
  notify: service(),
  errorHandler: service(),

  captchaResponse: null,

  topicList: [
    'Feedback',
    'Bug Report',
    'Feature Request',
    'Sign up Help',
    'Billing Help',
    'Other'
  ],

  didInsertElement() {
    this._super(...arguments);

    // focus email field
    this.element.querySelector('#emailInput').focus();
  },

  actions: {
    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    },

    onCaptchaResolved(reCaptchaResponse) {
      this.set('captchaResponse', reCaptchaResponse);
    },

    submitContactMessage() {
      let url = `${config.apiHost}/send_contact_us`;
      let captchaResponse = this.get('captchaResponse');
      console.log('sending message');
      if (captchaResponse) {
        console.log('captcha filled');
        jQuery.ajax(url, {
          data: JSON.stringify({
            captcha_token: captchaResponse,
            contact_email: this.inputemailAddress,
            topic: this.topicSelect,
            subject: this.inputSubject,
            message: this.inputMessage
          }),
          contentType: 'application/json',
          type: 'POST',
          success: () => {
            console.log('send success');
            this.notify.success(
              "Message received!<br>We'll be in a touch as soon as possible."
            );
          },
          error: err => {
            console.log('error sending message', err);
            if (err.responseJSON) {
              this.errorHandler.handleWithNotification(err.responseJSON);
            } else {
              this.notify.error(
                'Sorry, there was a problem sending your message.<br>Please try again later.'
              );
            }
          }
        });
      } else {
        this.notify.error("You must prove you're not a robot to continue");
      }
    }
  }
});
