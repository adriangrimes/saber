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
          if ( this.get('streamKeyHidden')){
              $('[id=streamKeyDisplayID]').val(this.get('streamKey'));
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
         if ( this.get('streamKeyHidden') == false){
             $('[id=streamKeyDisplayID]').val(newStreamKey);
           }

       this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

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
       this.set('streamKey', newStreamKey);

      },
      copyStreamKeyToClipboard(){
        /* Get the text field */
        var copyText =document.getElementById("streamKeyDisplayID");

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("Copy");

        /* notify the user */
        $('[id=keyCopySuccess]').addClass('d-block');
        $('[id=keyCopySuccess]').removeClass('d-hide');

        setTimeout(function() {
        $('[id=keyCopySuccess]').addClass('d-hide');
        $('[id=keyCopySuccess]').removeClass('d-block');
        }, 3000);


      },
  }

});
