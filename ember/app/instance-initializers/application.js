import TextField from '@ember/component/text-field';
import TextArea from '@ember/component/text-area';

export function initialize(/*appInstance*/) {
  // Allow data-lpignore attribute on {{input}} helper
  TextField.reopen({
    attributeBindings: ['data-lpignore']
  });
  TextArea.reopen({
    attributeBindings: ['data-lpignore']
  });
}

export default {
  initialize
};
