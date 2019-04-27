import Controller from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  store: inject(),
  session: inject(),
  themeChanger: inject(),
  countriesList: [
    'United States',
    'United Kingdom',
    'Afghanistan',
    'Albania',
    'Algeria',
    'American Samoa',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antarctica',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegowina',
    'Botswana',
    'Bouvet Island',
    'Brazil',
    'British Indian Ocean Territory',
    'Brunei Darussalam',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Cape Verde',
    'Cayman Islands',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Christmas Island',
    'Cocos (Keeling) Islands',
    'Colombia',
    'Comoros',
    'Congo',
    'Congo, the Democratic Republic of the',
    'Cook Islands',
    'Costa Rica',
    'Cote d Ivoire',
    'Croatia (Hrvatska)',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'East Timor',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands (Malvinas)',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'France, Metropolitan',
    'French Guiana',
    'French Polynesia',
    'French Southern Territories',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guadeloupe',
    'Guam',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Heard and Mc Donald Islands',
    'Holy See (Vatican City State)',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran (Islamic Republic of)',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Korea, Democratic Peoples Republic of',
    'Korea, Republic of',
    'Kuwait',
    'Kyrgyzstan',
    'Lao Peoples Democratic Republic',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libyan Arab Jamahiriya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia, The Former Yugoslav Republic of',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Martinique',
    'Mauritania',
    'Mauritius',
    'Mayotte',
    'Mexico',
    'Micronesia, Federated States of',
    'Moldova, Republic of',
    'Monaco',
    'Mongolia',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Niue',
    'Norfolk Island',
    'Northern Mariana Islands',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Pitcairn',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russian Federation',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint LUCIA',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia (Slovak Republic)',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Georgia and the South Sandwich Islands',
    'Spain',
    'Sri Lanka',
    'St. Helena',
    'St. Pierre and Miquelon',
    'Sudan',
    'Suriname',
    'Svalbard and Jan Mayen Islands',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syrian Arab Republic',
    'Taiwan, Province of China',
    'Tajikistan',
    'Tanzania, United Republic of',
    'Thailand',
    'Togo',
    'Tokelau',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks and Caicos Islands',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'United States Minor Outlying Islands',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Viet Nam',
    'Virgin Islands (British)',
    'Virgin Islands (U.S.)',
    'Wallis and Futuna Islands',
    'Western Sahara',
    'Yemen',
    'Yugoslavia',
    'Zambia',
    'Zimbabwe',
  ],

  actions: {
     checkLength(text, select /*, event */) {
       if (select.searchText.length >= 3 && text.length < 3) {
         return '';
       } else {
         return text.length >= 3;
       }
     },

     checkThis(toBeChecked){
       $("#"+toBeChecked).prop('checked', true).change();
     },

     checkBitcoin(toBeChecked){
       $("#"+toBeChecked).prop('checked', true).change();
       if (toBeChecked =="inputPayoutBitcoin") {
         this.set('payoutIsBitcoin', true);
       } else {
         this.set('payoutIsBitcoin', false);
       }
     },

     submitEmailSettings() {
       // Get current state of setting from page and set to a variable
       var sEFO = this.get('sendEmailFavoritesOnline');
       var sESN = this.get('sendEmailSiteNews');

       this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {
         console.log(user);
         // Modify record pulled from db to variable
         user.set('sendEmailFavoritesOnline', sEFO);
         user.set('sendEmailSiteNews', sESN);

         // Save record to db
         user.save().then(() => {
           console.log('submitEmailSettings saved');
           $('[id=emailsettingsubmit]').text('');
           $('[id=emailsettingsubmit]').addClass('fa fa-check');
         }).catch((reason) => {
           console.log('error saving user record: ' + reason);
           this.set('errorMessage', reason.errors || reason);
         });
       }).catch((reason) => {
         console.log('error finding user record: ' + reason);
         this.set('errorMessage', reason.errors || reason);
       });
     },

     submitDisplaySettings() {
       // Get current state of setting from page and set to a variable
       var updateTimeZone = this.get('inputTimeZone');
       if (this.get('currentUser.user.darkMode')) {
         this.get('themeChanger').set('theme', 'dark');
       } else {
         this.get('themeChanger').set('theme', 'default');
       }
       console.log('At /account display settings save currentUser.darkMode: '+this.get('currentUser.user.darkMode'))

       this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {
         console.log(user);
         // Modify record pulled from db to variable
         user.set('darkMode', this.get('currentUser.user.darkMode'));
         user.set('timezone', updateTimeZone);

         // Save record to db
         user.save().then(() => {
           console.log('submitDisplaySettings saved');
           $('[id=sitesettingsubmit]').text('');
           $('[id=sitesettingsubmit]').addClass('fa fa-check');
         }).catch((reason) => {
           console.log('error saving user record: ' + reason);
           this.set('errorMessage', reason.errors || reason);
         });
       }).catch((reason) => {
         console.log('error finding user record: ' + reason);
         this.set('errorMessage', reason.errors || reason);
       });
     },

     submitPayoutSettings() {
       // Get current state of setting from page and set to a variable
       var address1 = this.get('inputaddress1');
       var address2 = this.get('inputaddress2');
       var city = this.get('inputCity');
       var region = this.get('inputRegion');
       var zipcode = this.get('inputZipcode');
       var country = this.get('inputCountry');
       console.log(country);
       var address3 = (city+'|'+region+'|'+zipcode+'|'+country);

       this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {
         // Modify record pulled from db to variable
         user.set('addressLine1', address1);
         user.set('addressLine2', address2);
         user.set('addressLine3', address3);

         // Save record to db
         user.save().then(() => {
           console.log('submitPayoutSettings saved');
           $('[id=payoutsettingsubmit]').text('');
           $('[id=payoutsettingsubmit]').addClass('fa fa-check');
         }).catch((reason) => {
           console.log('error saving user record: ' + reason);
           this.set('errorMessage', reason.errors || reason);
         });
       }).catch((reason) => {
         console.log('error finding user record: ' + reason);
         this.set('errorMessage', reason.errors || reason);
       });
     },
   }

});
