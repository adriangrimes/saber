import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { isPresent } from '@ember/utils';
import config from '../config/environment';

export default Component.extend({
  activeStorage: service(),
  userFileManager: service(),

  fileUploadAttribute: 'files',
  currentUploads: 0,
  maximumUploads: 100000,
  disableUploads: computed('currentUploads', 'maximumUploads', function() {
    return this.get('currentUploads') >= this.get('maximumUploads');
  }),

  init() {
    this._super(...arguments);

    this.uploads = [];
    this.uploadErrors = [];
  },

  actions: {
    upload(event) {
      if (this.currentUploads >= this.maximumUploads) {
        this.set('uploadErrors', [
          {
            title: `More than ${this.get('maximumUploads')} uploads`,
            detail: `You may not upload more than ${this.get('maximumUploads')}
            images, please remove some before trying again.`
          }
        ]);
      } else {
        this.set('uploadErrors', []);
        const files = event.target.files;
        if (isPresent(files)) {
          const directUploadURL = `${config.apiHost}/rails/active_storage/direct_uploads`;
          for (var i = 0; i < files.length; i++) {
            get(this, 'activeStorage')
              .upload(files.item(i), directUploadURL, {
                onProgress: progress => {
                  set(this, 'uploads', progress);
                }
              })
              .then(blob => {
                this.onUploaded(blob);
              })
              .catch(err => {
                console.error(err);
                this.set('uploadErrors', [
                  {
                    title: 'Connection refused',
                    detail:
                      'Connection refused during upload, the server may be encountering issues. Please try again later.'
                  }
                ]);
              });
          }
        }
      }
    }
  }
});
