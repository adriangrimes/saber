export function initialize(/* application */) {
  // application.inject('route', 'foo', 'service:foo');

}

export default {
  name: 'websockets',
  initialize: function(app) {
        app.inject('component', 'websockets', 'service:websockets');
  }
};
