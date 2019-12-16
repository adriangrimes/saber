// Override ember-tag-input component to only allow alphanumeric input
import TagInput from 'ember-tag-input/components/tag-input';
import layout from '../templates/components/ember-tag-input/tag-input';

const KEY_CODES = {
  BACKSPACE: 8,
  COMMA: 188,
  ENTER: 13,
  SPACE: 32
};

const TAG_CLASS = 'emberTagInput-tag';
const REMOVE_CONFIRMATION_CLASS = 'emberTagInput-tag--remove';

export default TagInput.extend({
  layout,

  _onInputKeyDown(e) {
    const allowSpacesInTags = this.get('allowSpacesInTags');
    const tags = this.get('tags');
    const newTag = e.target.value.trim();

    if (e.which === KEY_CODES.BACKSPACE) {
      if (newTag.length === 0 && tags.length > 0) {
        const removeTagAtIndex = this.get('removeTagAtIndex');

        if (this.get('removeConfirmation')) {
          const lastTag = this.$('.' + TAG_CLASS).last();

          if (!lastTag.hasClass(REMOVE_CONFIRMATION_CLASS)) {
            lastTag.addClass(REMOVE_CONFIRMATION_CLASS);
            return;
          }
        }

        removeTagAtIndex(tags.length - 1);
      }
      // Allow alpha numeric only
    } else if (e.key.match(/[^A-Za-z0-9]+/)) {
      e.preventDefault();
    } else {
      console.log(e);
      if (
        e.which === KEY_CODES.COMMA ||
        (!allowSpacesInTags && e.which === KEY_CODES.SPACE) ||
        e.which === KEY_CODES.ENTER
      ) {
        if (newTag.length > 0) {
          if (this.addNewTag(newTag)) {
            e.target.value = '';
          }
        }
        e.preventDefault();
      }

      this.$('.' + TAG_CLASS).removeClass(REMOVE_CONFIRMATION_CLASS);
    }
  }
});
