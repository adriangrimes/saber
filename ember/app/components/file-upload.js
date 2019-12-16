import Component from '@ember/component';
import config from '../config/environment';
//import { computed } from '@ember/object';
// import { inject as service } from '@ember/service';
//import { isPresent } from '@ember/utils';

// Uppy imports
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';

export default Component.extend({
  minNumberOfFiles: 1,
  maxNumberOfFiles: 30,
  maxFileSize: 5 * 1024 * 1024,
  uploaderNote: 'Up to 30 images, up to 5 MB each',
  uploaderEndpoint: '/upload',

  init() {
    this._super(...arguments);
    if (!this.uploadLimitReachedMessage) {
      this.set(
        'uploadLimitReachedMessage',
        `You can only upload up to ${this.maxNumberOfFiles} files`
      );
    }
  },

  didInsertElement() {
    // initialize Uppy
    console.log('initializing Uppy');
    this.set(
      'uppy',
      Uppy({
        debug:
          config.environment !== 'production' ||
          config.environment !== 'staging',
        autoProceed: false,
        restrictions: {
          maxFileSize: this.maxFileSize,
          minNumberOfFiles: this.minNumberOfFiles,
          allowedFileTypes: ['.png', '.jpeg', '.jpg'] //, 'video/*']
        },
        onBeforeUpload: files => {
          console.log(files);
          console.log(
            'before upload hit - record count: ',
            Object.keys(files).length
          );
          var fileCount = 0;
          Object.keys(files).forEach(fileId => {
            if (files[fileId].progress.uploadComplete == false) {
              console.log('found unuploaded file');
              fileCount += 1;
            }
          });
          console.log(fileCount);
          if (this.model.length + fileCount > this.maxNumberOfFiles) {
            this.uppy.info(this.uploadLimitReachedMessage, 'error', 5000);
            return false;
          }
        }
      })
        .use(Webcam, {
          id: 'Webcam',
          modes: ['picture'],
          title: 'Webcam',
          mirror: false
        })
        .use(Dashboard, {
          inline: true,
          showSelectedFiles: true,
          height: 350,
          target: '#dashboard-area',
          proudlyDisplayPoweredByUppy: false,
          plugins: ['Webcam'],
          note: this.uploaderNote
        })
        .use(XHRUpload, {
          endpoint: config.apiHost + this.uploaderEndpoint,
          limit: 5
        })
        .on('complete', result => {
          if (result.failed.length == 0) {
            console.log('all files uploaded successfully');
            this.get('uppy').cancelAll();
            this.onUploaded(result.successful);
          }
        })
    );
  },

  willDestroyElement() {
    console.log('destroying file-upload element');
    this.get('uppy').close();
  }
});
