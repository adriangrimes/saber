export function initialize(app) {
  app.inject('route', 'errorHandler', 'service:error-handler');
  app.inject('controller', 'errorHandler', 'service:error-handler');
  app.inject('component', 'errorHandler', 'service:error-handler');
}

export default {
  name: 'error-handler',
  initialize
};
