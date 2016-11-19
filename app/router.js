import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('profile');
  this.route('account');
  this.route('terms');
  this.route('privacy');
  this.route('contact');
  this.route('faq');
  this.route('games');
  this.route('fullSignup');
  this.route('delete');
});

export default Router;
