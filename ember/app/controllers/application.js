import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

//Controller - application
export default Controller.extend({
  store: service(),
  session: service(),
  notify: service(),
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

    cubeDropdownClicked(dropdown) {
      console.log(dropdown);
    }
  }
});
