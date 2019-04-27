import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    $('#loginModal').on('shown.bs.modal', function() {
      $('#username').trigger('focus');
    });
  }
});
