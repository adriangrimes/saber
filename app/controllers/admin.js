import Ember from 'ember';

export default Ember.Controller.extend({


    verifications: 6,
    gamesPlayed: 0,
    newUsers: 12,
    activeBroadcasters: 0,
    nextContestStart: "10-01-2015",
    nextContestEnd: "10-31-2015",

    nextContestTitle:"Halloween Contest Weee",
    nextEventStart: "07-13-2017",
    nextEventEnd: "08-31-2017",
    nextEventTitle: "Summer Event Weee",




      actions: {
        openVerification(model){
         var toOpen = document.getElementById('verifyPanel.'+model.id);
         let toCloseList = document.getElementsByClassName('verifyPanelClass');
         for (var i = 0; i < toCloseList.length; i++) {
           toCloseList[i].style.display ='none';
          }
          toOpen.style.display = 'block';
         },
         blockUser(model){
            var toClose = document.getElementById('verifyPanel.'+model.id);
            //set user status to Blocked or blacklisted or something. Do Not alert them.
            //show admin notification
            //Close Panel
            toClose.style.display = 'none';
            console.log('Blocking User: '+model.username+' ID: '+ model.id);

         },
         VerifyUser(model){
            var toClose = document.getElementById('verifyPanel.'+model.id);
            // set user status to verified
            //email user about their new status
            //show admin notification
            //close Panel
            toClose.style.display = 'none';
            console.log('Verifying User: '+model.username+' ID: '+ model.id);

         },
         requestInfo(model){
           var toClose = document.getElementById('verifyPanel.'+model.id);
           //Allow admin to mark areas that need to be updated
           //send email to user
           //show admin notification
           //close Panel
             toClose.style.display = 'none';
            console.log('Requesting info from User: '+model.username+' ID: '+ model.id);
         },

    }

});
