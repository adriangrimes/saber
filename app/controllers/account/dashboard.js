import Controller from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({


  store: inject(),
  session: inject(),
  streamKeyDisplay: '********************',
  streamKeyHidden: true,



   actions: {
          showStreamKey(){
          if ( this.streamKeyHidden){
              $('[id=streamKeyDisplayID]').val(this.currentStreamKey);
              this.set('streamKeyHidden', false);
              $('[id=showStreamKeyBtn]').text('Hide Stream Key');
            }else{
              this.set('streamKeyHidden', true);
              $('[id=streamKeyDisplayID]').val('********************');

              $('[id=showStreamKeyBtn]').text('Show Stream Key');
            }
          },
      resetStreamKey(){
        // Get current state of setting from page and set to a variable
       var  newStreamKey = '';
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

         for (var i = 0; i < 64; i++){
           newStreamKey += possible.charAt(Math.floor(Math.random() * possible.length));
         }
         if ( this.streamKeyHidden == false){
             $('[id=streamKeyDisplayID]').val(newStreamKey);
           }

           this.set('currentStreamKey', newStreamKey);
           this.store.findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

         // Modify record pulled from db to variable
         user.set('streamKey', newStreamKey);
         // Save record to db
         user.save().then(() => {
           console.log('newStreamKey saved');
           $('[id=resetStreamKeyIcon]').addClass('fa-spin');
           setTimeout(function() {
             $('[id=resetStreamKeyIcon]').removeClass('fa-spin');
           }, 2000);



         }).catch((reason) => {
           console.log('error saving user record: ' + reason);
           this.set('errorMessage', reason.errors || reason);
         });
       }).catch((reason) => {
         console.log('error finding user record: ' + reason);
         this.set('errorMessage', reason.errors || reason);
       });
       $('[id=newCopySuccess]').addClass('d-block');
       $('[id=newCopySuccess]').removeClass('d-hide');

       setTimeout(function() {
       $('[id=newCopySuccess]').addClass('d-hide');
       $('[id=newCopySuccess]').removeClass('d-block');
     }, 3000);


      },
      copyStreamKeyToClipboard(){

          if (this.streamKeyHidden == false){
            var copyText = document.getElementById("streamKeyDisplayID");

            copyText.select();

            document.execCommand("Copy");

            $('[id=keyCopySuccess]').addClass('d-block');
            $('[id=keyCopySuccess]').removeClass('d-hide');

            setTimeout(function() {
            $('[id=keyCopySuccess]').addClass('d-hide');
            $('[id=keyCopySuccess]').removeClass('d-block');
          }, 3000);
          }
      },

      submitStreamSettings() {
        // Get current state of setting from page and set to a variable
       var updateEnableTips = this.enableTips;



        this.store.findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

          // Modify record pulled from db to variable
          user.set('allowTips', updateEnableTips);


          // Save record to db
          user.save().then(() => {
            console.log('submitPayoutSettings saved');
            $('[id=streamSettingsSubmit]').text('');
            $('[id=streamSettingsSubmit]').addClass('fa fa-check');
          }).catch((reason) => {
            console.log('error saving user record: ' + reason);
            this.set('errorMessage', reason.error || reason);
          });
        }).catch((reason) => {
          console.log('error finding user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
      },
  }
});
