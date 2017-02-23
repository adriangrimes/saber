import Ember from 'ember';

export default Ember.Service.extend({

  store: Ember.inject.service(),

  loggedIn: false,
  username: '',
  userType: '',

  init() {
    this._super(...arguments);

    //jenk autologin for now
    var user = document.cookie.match(new RegExp('username' + '=([^;]+)'));
    var password = document.cookie.match(new RegExp('password' + '=([^;]+)'));
    if (user && password) {
      if (user[1] != null && password[1] != null) {
        this.set('loggedIn', false);
        console.log("autologging in: " + user[1]);
        this.logIn(user[1], password[1]);
      }
    }
    //if some sort of cookie found run logIn()??? for autologin
    //how do sites even do that
  },

  logIn(user, pw) {
    //do login work here
    //TODO input validation
    console.log('Username: '+ user);
    console.log('Password: '+ pw +' ...lol');
    let that = this;
    this.get('store').queryRecord('user', {username: user, password: pw}).then(function(){
      console.log('auth success');
      that.set('loggedIn', true);
      that.set('username', user);

      //start cookie
      var date = new Date();
      // 30 day expiration
      var days = 30;
      // Get unix milliseconds at current time plus number of days
      date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000
      document.cookie ="username="+user+ "; expires=" + date.toGMTString();
      document.cookie ="password="+pw+ "; expires=" + date.toGMTString();

      Ember.$('#loginModal').modal('hide'); //close log in modal
      Ember.$('#loginModal > div > div > form > div > button > div').removeClass('spinner');
      Ember.$('#loginModal > div > div > form > div > button > div').replaceWith('Log In');
    }, function(error) {
      // for (var i = 0, len = error.length; i < len; i++) {
      //   console.log(error.errors[i].status);
      // }

      console.log('auth failed');
      that.set('loggedIn', false);
      Ember.$('#loginModal > div > div > form > div > button > div').removeClass('spinner');
      Ember.$('#loginModal > div > div > form > div > button > div').replaceWith('Log In');
    });
  },

  logOut() {
    //do logout work here
    //TODO input validation
    console.log("logged out");
    this.set('loggedIn', false);
    this.set('username', '');
    var date = new Date();

    // 30 day expiration
    var days = -30;

    // Get unix milliseconds at current time plus number of days
    date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000
    document.cookie ="username=; expires=" + date.toGMTString();
    document.cookie ="password=; expires=" + date.toGMTString();
    Ember.getOwner(this).lookup('router:main').transitionTo('index');
    this.get('store').unloadAll('user');
  },

  signUp(user, email, pw, pwconfirm) {
    //TODO input validation
    if (pw === pwconfirm && user && email) {
      let that = this;
      var signup = this.get('store').createRecord('user', {
        username: user,
        email: email,
        password: pw
      });
      signup.save().then(function(){
        console.log("signed up");
        Ember.$('#loginModal').modal('hide'); //close log in modal
      }, function(error) {
        // for (var i = 0, len = error.length; i < len; i++) {
        //   console.log(error.errors[i].status);
        // }

        console.log('signup failed');
        that.set('loggedIn', false);
        Ember.$('#loginModal').modal('hide'); //close log in modal
        Ember.$('#loginModal > div > div > form > div > button > div').removeClass('spinner');
        Ember.$('#loginModal > div > div > form > div > button > div').replaceWith('Sign me up!');
      });

    } else {
      console.log('error: passwords do not match');
    }
  },



});
