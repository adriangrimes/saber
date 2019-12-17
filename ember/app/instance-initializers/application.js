import TextField from '@ember/component/text-field';
import TextArea from '@ember/component/text-area';
import config from '../config/environment';

export function initialize(/*appInstance*/) {
  // Allow data-lpignore attribute on {{input}} helper
  TextField.reopen({
    attributeBindings: ['data-lpignore']
  });
  TextArea.reopen({
    attributeBindings: ['data-lpignore']
  });

  // convert console logs to a no-op when production or staging
  if (config.environment === 'production' || config.environment === 'staging') {
    var noOp = function() {}; // no-op function
    window.console.log = noOp;
    window.console.error = noOp;
    window.console.warning = noOp;
  }
}

export default {
  initialize
};
