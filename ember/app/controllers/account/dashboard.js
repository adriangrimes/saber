import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';

export default Controller.extend({
  store: service(),
  session: service(),
  errorHandler: service(),


  actions: {

  }
});
