import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  didInsertElement() {
    $('#loginModal').on('shown.bs.modal', function() {
      $('#username').trigger('focus');
    });
  }
});
