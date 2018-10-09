import Controller from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

//Controller - application
export default Controller.extend({
  // copyrightYear: is set in app/instance-initializer/application

  store: inject(),
  session: inject(),
  themeChanger: inject(),

  init() {
    console.log('At Application Init loginstate.darkMode: '+this.get('loginState.darkMode'))
    var darkModeCheckbox = this.get('loginState.darkMode');
  },


  actions: {

    logout() {
      this.get('loginState').logOut();
      this.transitionToRoute('index');
    },
    scrollToTop(){
      window.scrollTo(0,0);
    },
    toggleDarkMode() {
      // Get current state of setting from page and set to a variable
      if (this.get('darkModeCheckbox')) {
        this.get('themeChanger').set('theme', 'dark');
      } else {
        this.get('themeChanger').set('theme', 'default');
      }

      this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

        // Modify record pulled from db to variable
        user.set('darkMode', this.get('darkModeCheckbox'));


        // Save record to db
        user.save().then(() => {
          console.log('toggleDarkMode Settings saved');
          $('[id=darkMode]').prop('checked');
        }).catch((reason) => {
          console.log('error saving user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.error || reason);
      });
    }
  }


});
