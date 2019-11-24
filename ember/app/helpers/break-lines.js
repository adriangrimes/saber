import { helper } from '@ember/component/helper';
import Ember from 'ember';
import { htmlSafe } from '@ember/string';

export default helper(function breakLines(param /*, hash*/) {
  let text = Ember.Handlebars.Utils.escapeExpression(param);
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return htmlSafe(text);
});
