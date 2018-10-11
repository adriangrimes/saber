import Component from '@ember/component';

export default Component.extend({
    actions: {
      closeModal() {
        this.set('currentUser.errorMessage', []);
      }
    }
});
