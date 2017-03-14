export function initialize(app) {
  app.inject('route', 'loginState', 'service:login-state');
  app.inject('controller', 'loginState', 'service:login-state');
  app.inject('component', 'loginState', 'service:login-state');
}

export default {
  name: 'login-state',
  initialize
};
