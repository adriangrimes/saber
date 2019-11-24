import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    var agent = navigator.userAgent;
    var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
    var matches = agent.match(reg);
    if (matches != null && matches[1] <= 10) {
      this.notify.warning(
        "It looks like you're using an older version of Internet Explorer. Please upgrade to version 11 or higher, otherwise the site may not work correctly."
      );
    }
  }
});
