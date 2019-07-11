import Component from '@ember/component';

// edit-photos
export default Component.extend({

  userPhotos:[
    { id:'1',
      profilePhoto: true,
      private: false ,
      src: '/usericon.svg',
    },
    { id:'2',
      profilePhoto: false,
      private: true ,
      src: '/usericon.svg',
    },
    { id:'3',
      profilePhoto: false,
      private: false ,
      src: '/usericon.svg',
    },
    { id:'4',
      profilePhoto: false,
      private: false ,
      src: '/usericon.svg',
    },
  ],

  photoSubmitBtn: 'btn btn-primary',
  photoSubmitText: 'Save',


  actions: {
    submitPhotoSettings() {
      console.log('submit photo settings saved');
      this.set('photoSubmitText', '');
      this.set(
        'photoSubmitBtn',
        'btn btn-primary fa fa-check'
      );
    },
}
});
