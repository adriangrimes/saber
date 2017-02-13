import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('profile', { path: '/profile/:profile_id' });
  this.route('account', function() {
    this.route('developer');
    this.route('broadcaster');
    this.route('delete');
  });
  this.route('terms');
  this.route('privacy');
  this.route('contact');
  this.route('faq');
  this.route('games');
  this.route('fullSignup');
  this.route('delete');
  this.route('signup', function() {
    this.route('dev');
    this.route('broadcaster');
    this.route('developer');
  });
});

export default Router;
