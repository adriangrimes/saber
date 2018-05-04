import Controller from '@ember/controller';

//Controller - application
export default Controller.extend({
  // copyrightYear: is set in app/instance-initializer/application

  actions: {
    logout() {
      this.get('loginState').logOut();
      this.transitionToRoute('index');
    },
    scrollToTop(){
      window.scrollTo(0,0);
    }
  }


});
