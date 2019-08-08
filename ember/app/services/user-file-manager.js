import Service from '@ember/service';

export default Service.extend({
  attachUploadedFileToModel(blob, model, attribute) {
    console.log('attaching file');
    this.set('model', model);
    // console.log(model);
    this.get('model.' + attribute).pushObject({
      signed_id: blob.signedId,
      delete: false
    });
    // Attach upload to user account
    this.model
      .save()
      .then(() => {
        console.log('model saved');
      })
      .catch(() => {
        console.log('model failed to save');
      });
  },

  deleteFileFromUser(file) {
    // Set delete property to true on file, and save model to back-end to delete
    file.delete = true;
    // file attachment and blob
    this.model
      .save()
      .then(() => {
        console.log('model saved');
      })
      .catch(() => {
        console.log('model failed to save');
      });
  }
});
