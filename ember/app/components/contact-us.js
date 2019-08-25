import Component from '@ember/component';
import jQuery from 'jquery';
import config from '../config/environment';

export default Component.extend({
  captchaObject: null,
  messageSuccessfullySent: false,

  topicList: [
    'Bug Report',
    'Feature Request',
    'Sign up Help',
    'Billing Help',
    'Other'
  ],

  didInsertElement() {
    this._super(...arguments);
    let that = this;
    jQuery
      .getScript('https://www.google.com/recaptcha/api.js')
      .done(function() {
        that.set('captchaObject', grecaptcha);
      })
      .fail(function() {
        console.log('failed to get script');
      });
  },

  actions: {
    submitContactMessage() {
      let url = `${config.apiHost}/send_contact_us`;
      let captchaResponse = this.get('captchaObject').getResponse();
      console.log('sending message');
      if (captchaResponse) {
        console.log('captcha filled');
        this.currentUser.set('errorMessages', []);
        let that = this;
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
          success: function() {
            console.log('send success');
            that.set('messageSuccessfullySent', true);
          },
          error: function(err) {
            console.log('error sending message');
            that.currentUser.set('errorMessages', [
              {
                title: 'Error sending message',
                detail: err.responseJSON.errors
              }
            ]);
          }
        });
      } else {
        this.currentUser.set('errorMessages', [
          {
            title: 'Captcha required',
            detail: "You must prove you're not a robot to continue"
          }
        ]);
      }
    },

    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    }
  }
});
