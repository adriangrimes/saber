import Controller from '@ember/controller';
import { inject } from '@ember/service';

//Controller - application
export default Controller.extend({
  store: inject(),
  session: inject(),
  themeChanger: inject(),
  //copyrightYear: is set in app/instance-initializer/application

  init() {
    this._super(...arguments);
  },

  actions: {
    logout() {
      this.currentUser.logOut();
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    toggleDarkMode() {
      // Get current state of setting from page and set to a variable
      if (this.get('currentUser.user.darkMode')) {
        this.themeChanger.set('theme', 'dark');
      } else {
        this.themeChanger.set('theme', 'default');
      }
      // Get record to save darkMode to
      this.store
        .findRecord('user', this.get('session.data.authenticated.user_id'))
        .then(user => {
          // Modify record pulled from db to variable
          user.set('darkMode', this.get('currentUser.user.darkMode'));
          // Save record to db
          user.save().catch(reason => {
            console.log('error saving user record: ' + reason);
            this.set('errorMessage', reason.errors || reason);
          });
        })
        .catch(reason => {
          console.log('error finding user record: ' + reason);
          this.set('errorMessage', reason.errors || reason);
        });
    }
  }
});
