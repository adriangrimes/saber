import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

//Controller - application
export default Controller.extend({
  router: service(),
  store: service(),
  session: service(),
  notify: service(),
  errorHandler: service(),

  copyrightYear: new Date().getFullYear(),
  currentRouteName: computed('router.currentRouteName', function() {
    return this.get('router.currentRouteName');
  }),

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
