import DS from 'ember-data';

export default DS.Model.extend({

  helpSections: DS.hasMany('help-section'),
  shortTitle: DS.attr('string'),
  title: DS.attr('string'),
  all: DS.attr('boolean'),
  devCasters: DS.attr('boolean'),
  broadcasters: DS.attr('boolean'),
  developers: DS.attr('boolean'),
});
