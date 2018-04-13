import Controller from '@ember/controller';
import $ from 'jquery';

export default Controller.extend({
  
  openSearchTab: function() {
    $(this).tab('show');
  },

});
