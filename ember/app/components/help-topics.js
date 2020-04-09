import Component from '@ember/component';
import { once } from '@ember/runloop';
import jQuery from 'jquery';
import { filter } from '@ember/object/computed';

export default Component.extend({
  show: null,
  for: null,
  helpTopicsToShow: '',
  helpForTitle: '',
  validForCategories: ['broadcasters', 'developers', 'contractors'],

  isBroadcaster: false,
  isDeveloper: false,
  isContracted: false,

  applicableHelpTopics: filter(
    'model',
    [
      'for',
      'isBroadcaster',
      'isDeveloper',
      'isContracted',
      'validForCategories'
    ],
    function(helpTopic /*, index , array*/) {
      if (helpTopic.allUsers) return true;
      if (this.for && this.validForCategories.includes(this.for)) {
        if (this.for == 'broadcasters' && helpTopic.broadcastersOnly) {
          return true;
        } else if (this.for == 'developers' && helpTopic.developersOnly) {
          return true;
        } else if (this.for == 'contractors' && helpTopic.contractorsOnly) {
          return true;
        }
      } else {
        if (this.isBroadcaster && helpTopic.broadcastersOnly) {
          return true;
        } else if (this.isDeveloper && helpTopic.developersOnly) {
          return true;
        } else if (this.isContracted && helpTopic.contractorsOnly) {
          return true;
        }
      }
      return false;
    }
  ),

  init() {
    this._super(...arguments);
    if (this.for && this.validForCategories.includes(this.for)) {
      this.set('helpForTitle', this.for);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this.gotoHelpTopic();
  },

  willRender() {
    this._super(...arguments);
    this.gotoHelpTopic();
  },

  gotoHelpTopic() {
    let helpTopic = jQuery('#' + this.get('show'));
    if (this.show && helpTopic.position() != undefined) {
      once(this, function() {
        jQuery('#main-outlet').animate(
          {
            scrollTop: helpTopic.position().top
          },
          500
        );
      });
    }
  }
});
