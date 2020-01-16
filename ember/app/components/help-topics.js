import Component from '@ember/component';
import { once } from '@ember/runloop';
import jQuery from 'jquery';

export default Component.extend({
  show: null,

  didInsertElement() {
    this._super(...arguments);
    // if (query string specifies a "for" parameter) {
    //   set visible help topics
    // } else {
    //   use the users current contractor state
    // }
    this.gotoHelpTopic();
  },

  willRender() {
    this._super(...arguments);
    this.gotoHelpTopic();
  },

  gotoHelpTopic() {
    if (this.show) {
      once(this, function() {
        jQuery('html, body').animate(
          {
            scrollTop: jQuery('#' + this.get('show')).offset().top
          },
          300
        );
      });
    }
  }
});
