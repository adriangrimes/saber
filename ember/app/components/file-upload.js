import Component from '@ember/component';
//import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
//import { isPresent } from '@ember/utils';
import config from '../config/environment';

// Uppy imports
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Webcam from '@uppy/webcam';
import XHRUpload from '@uppy/xhr-upload';

export default Component.extend({
  userFileManager: service(),

  // init() {
  //   this._super(...arguments);
  // },

  didInsertElement() {
    // initialize Uppy
    console.log('initializing Uppy');
    this.set(
      'uppy',
      Uppy({
        debug: true,
        autoProceed: false,
        restrictions: {
          maxFileSize: 5 * 1024 * 1024,
          minNumberOfFiles: 1,
          allowedFileTypes: ['.png', '.jpeg', '.jpg'] //, 'video/*']
        }
      })
        .use(Webcam, {
          modes: ['picture'],
          title: 'Webcam',
          mirror: false
        })
        .use(Dashboard, {
          inline: true,
          target: '#dashboard-area',
          proudlyDisplayPoweredByUppy: false,
          plugins: ['Webcam'],
          note: 'Up to 30 images, up to 5 MB each'
          // trigger: '#select-files'
        })
        .use(XHRUpload, { endpoint: `${config.apiHost}/upload`, limit: 10 })
        .on('complete', result => {
          if (result.failed.length == 0) {
            console.log('all files uploaded successfully');
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
