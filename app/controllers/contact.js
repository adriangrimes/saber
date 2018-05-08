import Controller from '@ember/controller';

export default Controller.extend({

  topicList: [
    'Bug Report',
    'Feature Request',
    'Sign up Help',
    'Billing Help',
    'Other',
  ],

  actions: {
    submitContactMessage(){

    },
    checkLength(text, select /*, event */) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  },

  },
});
