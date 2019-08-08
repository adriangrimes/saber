export function initialize(app) {
  app.inject('route', 'currentUser', 'service:current-user');
  app.inject('controller', 'currentUser', 'service:current-user');
  app.inject('component', 'currentUser', 'service:current-user');
}

export default {
  name: 'current-user',
  initialize
};
