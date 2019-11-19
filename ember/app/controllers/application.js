import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

//Controller - application
export default Controller.extend({
  store: service(),
  session: service(),
  themeChanger: service(),
  errorHandler: service(),

  copyrightYear: new Date().getFullYear(),

  actions: {
    logout() {
      this.currentUser.logOut();
    },

    keepDropdownOpen(openDropdown) {
      openDropdown();
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
          user.save().catch(err => {
            console.log('error saving user record:', err);
            this.errorHandler.handleWithNotification(err);
            user.rollbackAttributes();
          });
        })
        .catch(err => {
          console.log('error finding user record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
