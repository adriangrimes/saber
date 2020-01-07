import Component from '@ember/component';
import jQuery from 'jquery';
export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    jQuery('#to-top').hide();
    jQuery(window).scroll(function() {
      if (jQuery(this).scrollTop() > 50) {
        jQuery('#to-top').fadeIn();
      } else {
        jQuery('#to-top').fadeOut();
      }
    });
    // scroll body to 0px on click
    jQuery('#to-top').click(function() {
      jQuery('html, body').animate(
        {
          scrollTop: 0
        },
        500
      );
      return false;
    });
  }
});
