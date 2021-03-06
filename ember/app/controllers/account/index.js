import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';
import { later } from '@ember/runloop';

export default Controller.extend({
  store: service(),
  session: service(),
  notify: service(),
  errorHandler: service(),

  notesSaveStart: false,
  notesSaveSuccess: false,

  streamSettingsSaveStart: false,
  streamSettingsSaveSuccess: false,

  notifySettingsSaveSuccess: false,
  notifysettingsSaveStart: false,

  payoutSettingsSaveStart: false,
  payoutSettingsSaveSuccess: false,

  emailSaveStart: false,
  emailSaveSuccess: false,

  passwordSaveStart: false,
  passwordSaveSuccess: false,

  siteSettingsSaveSuccess: false,
  siteSettingsSaveStart: false,

  streamKeyDisplay: '•••••••••••••••••••••',
  streamKeyObfuscatedDisplay: '•••••••••••••••••••••',
  streamKeyHidden: true,
  streamServer: 'rtmp://saber.solversion.com/stream',
  toggleHideStreamKeyText: 'Show Stream Key',
  keyCopySuccess: false,
  newCopySuccess: false,
  serverCopySuccess: false,

  timezoneList: [
    '(GMT, UTC+00:00) Monrovia, Reykjavik',
    '(GMT, UTC+00:00) Dublin, Edinburgh, Lisbon, London',
    '(UTC, UTC+00:00) Coordinated Universal Time',
    '(ECT, UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
    '(ECT, UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague',
    '(ECT, UTC+01:00) Brussels, Copenhagen, Madrid, Paris',
    '(ECT, UTC+01:00) Casablanca',
    '(ECT, UTC+01:00) Sao Tome',
    '(ECT, UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb',
    '(ECT, UTC+01:00) West Central Africa',
    '(EET, UTC+02:00) Amman',
    '(GTB, UTC+02:00) Athens, Bucharest',
    '(EET, UTC+02:00) Beirut',
    '(EET, UTC+02:00) Cairo',
    '(EET, UTC+02:00) Chisinau',
    '(EET, UTC+02:00) Damascus',
    '(EET, UTC+02:00) Gaza, Hebron',
    '(EET, UTC+02:00) Harare, Pretoria',
    '(EET, UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius',
    '(EET, UTC+02:00) Jerusalem',
    '(EAT, UTC+03:00) Baghdad',
    '(EAT, UTC+03:00) Istanbul',
    '(EAT, UTC+03:00) Kuwait, Riyadh',
    '(EAT, UTC+03:00) Minsk',
    '(EAT, UTC+03:00) Moscow, St. Petersburg',
    '(EAT, UTC+03:00) Nairobi',
    '(MET, UTC+03:30) Tehran',
    '(NET, UTC+04:00) Abu Dhabi, Muscat',
    '(NET, UTC+04:00) Baku',
    '(NET, UTC+04:00) Izhevsk, Samara',
    '(NET, UTC+04:00) Port Louis',
    '(NET, UTC+04:00) Volgograd',
    '(NET, UTC+04:00) Yerevan',
    '(AFT, UTC+04:30) Kabul',
    '(PLT, UTC+05:00) Ashgabat, Tashkent',
    '(PLT, UTC+05:00) Ekaterinburg',
    '(PLT, UTC+05:00) Islamabad, Karachi',
    '(IST, UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    '(IST, UTC+05:30) Sri Jayawardenepura',
    '(NPT, UTC+05:45) Kathmandu',
    '(BST, UTC+06:00) Astana',
    '(BST, UTC+06:00) Dhaka',
    '(BST, UTC+06:00) Omsk',
    '(MMT, UTC+06:30) Yangon (Rangoon)',
    '(VST, UTC+07:00) Bangkok, Hanoi, Jakarta',
    '(VST, UTC+07:00) Barnaul, Gorno-Altaysk',
    '(VST, UTC+07:00) Hovd',
    '(VST, UTC+07:00) Krasnoyarsk',
    '(VST, UTC+07:00) Novosibirsk',
    '(VST, UTC+07:00) Tomsk',
    '(CTT, UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi',
    '(CTT, UTC+08:00) Irkutsk',
    '(CTT, UTC+08:00) Kuala Lumpur, Singapore',
    '(CTT, UTC+08:00) Perth',
    '(CTT, UTC+08:00) Taipei',
    '(CTT, UTC+08:00) Ulaanbaatar',
    '(CTT, UTC+08:00) Eucla',
    '(JST, UTC+09:00) Chita',
    '(JST, UTC+09:00) Osaka, Sapporo, Tokyo',
    '(JST, UTC+09:00) Pyongyang',
    '(JST, UTC+09:00) Seoul',
    '(JST, UTC+09:00) Yakutsk',
    '(ACT, UTC+09:30) Adelaide',
    '(ACT, UTC+09:30) Darwin',
    '(AET, UTC+10:00) Brisbane',
    '(AET, UTC+10:00) Canberra, Melbourne, Sydney',
    '(AET, UTC+10:00) Guam, Port Moresby',
    '(AET, UTC+10:00) Hobart',
    '(AET, UTC+10:00) Vladivostok',
    '(LHST, UTC+10:30) Lord Howe Island',
    '(SST, UTC+11:00) Bougainville Island',
    '(SST, UTC+11:00) Chokurdakh',
    '(SST, UTC+11:00) Magadan',
    '(SST, UTC+11:00) Norfolk Island',
    '(SST, UTC+11:00) Sakhalin',
    '(SST, UTC+11:00) Solomon Is., New Caledonia',
    '(NST, UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky',
    '(NST, UTC+12:00) Auckland, Wellington',
    '(NST, UTC+12:00) Coordinated Universal Time+12',
    '(NST, UTC+12:00) Fiji',
    '(CHAST, UTC+12:45) Chatham Islands',
    '(SST, UTC+13:00) Coordinated Universal Time+13',
    '(SST, UTC+13:00) Samoa',
    '(LINT, UTC+14:00) Kiritimati Island',
    '(DST, UTC-12:00) International Date Line West',
    '(MIT, UTC-11:00) Coordinated Universal Time-11',
    '(HST, UTC-10:00) Aleutian Islands',
    '(HST, UTC-10:00) Hawaii',
    '(MST, UTC-09:30) Marquesas Islands',
    '(AST, UTC-09:00) Alaska',
    '(AST, UTC-09:00) Coordinated Universal Time-09',
    '(PST, UTC-08:00) Baja California',
    '(PST, UTC-08:00) Coordinated Universal Time-08',
    '(PST, UTC-08:00) (UTC-08:00) Pacific Time (US & Canada)',
    '(PNT, UTC-07:00) Arizona',
    '(MST, UTC-07:00) Chihuahua, La Paz, Mazatlan',
    '(MST, UTC-07:00) Mountain Time (US & Canada)',
    '(CST, UTC-06:00) Central America',
    '(CST, UTC-06:00) Central Time (US & Canada)',
    '(CST, UTC-06:00) Easter Island',
    '(CST, UTC-06:00) Guadalajara, Mexico City, Monterrey',
    '(CST, UTC-06:00) Saskatchewan',
    '(EST, UTC-05:00) Bogota, Lima, Quito, Rio Branco',
    '(EST, UTC-05:00) Chetumal',
    '(EST, UTC-05:00) Eastern Time (US & Canada)',
    '(EST, UTC-05:00) Haiti',
    '(EST, UTC-05:00) Havana',
    '(EST, UTC-05:00) Turks and Caicos',
    '(IET, UTC-05:00) Indiana (East)',
    '(PRT, UTC-04:00) Asuncion',
    '(PRT, UTC-04:00) Atlantic Time (Canada)',
    '(PRT, UTC-04:00) Caracas',
    '(PRT, UTC-04:00) Cuiaba',
    '(PRT, UTC-04:00) Georgetown, La Paz, Manaus, San Juan',
    '(PRT, UTC-04:00) Santiago',
    '(CNT, UTC-03:30) Newfoundland',
    '(AGT, UTC-03:00) City of Buenos Aires',
    '(BET, UTC-03:00) Brasilia',
    '(WGT, UTC-03:00) Greenland',
    '(U-2, UTC-02:00) Coordinated Universal Time-02',
    '(CAT, UTC-01:00) Azores',
    '(CAT, UTC-01:00) Cabo Verde Is.'
  ],
  timeZoneSearch(timezone, term) {
    //not turned on or working currently
    return `${timezone.name} ${timezone.utc}`.indexOf(term);
  },

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
    'Zimbabwe'
  ],

  actions: {
    showStreamKey() {
      if (this.streamKeyHidden) {
        this.set('streamKeyHidden', false);
        jQuery('[id=streamKeyDisplayID]').val(this.model.user.streamKey);
        this.set('toggleHideStreamKeyText', 'Hide Stream Key');
      } else {
        this.set('streamKeyHidden', true);
        jQuery('[id=streamKeyDisplayID]').val(this.streamKeyObfuscatedDisplay);

        this.set('toggleHideStreamKeyText', 'Show Stream Key');
      }
    },

    copyStreamKeyToClipboard() {
      if (this.streamKeyHidden == false) {
        var copyText = document.getElementById('streamKeyDisplayID');
        copyText.select();
        document.execCommand('Copy');
        this.set('keyCopySuccess', true);
        later(
          this,
          function() {
            this.set('keyCopySuccess', false);
          },
          3000
        );
      }
    },

    copyServerToClipboard() {
      var copyText = document.getElementById('streamServerDisplay');
      copyText.select();
      document.execCommand('Copy');
      this.set('serverCopySuccess', true);
      later(
        this,
        function() {
          this.set('serverCopySuccess', false);
        },
        3000
      );
    },

    resetStreamKey() {
      // Set streamKey to any value, keys are generated on the API side
      this.model.user.set('streamKey', '');
      // Save record to db
      this.model.user
        .save()
        .then(user => {
          console.log('newStreamKey saved');
          this.set('newCopySuccess', true);
          later(
            this,
            function() {
              this.set('newCopySuccess', false);
            },
            3000
          );
          if (this.streamKeyHidden) {
            this.set('streamKeyDisplay', this.streamKeyObfuscatedDisplay);
          } else {
            this.set('streamKeyDisplay', user.streamKey);
          }
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    submitStreamSettings() {
      this.set('streamSettingsSaveStart', true);
      // Save record to db
      this.model.userPublicDatum
        .save()
        .then(() => {
          console.log('submitStreamSettings saved');
          this.set('streamSettingsSaveSuccess', true);
        })
        .catch(err => {
          console.log('error saving userPublicDatum record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    submitUserNotes() {
      this.set('notesSaveStart', true);

      // Save record to db
      this.model.user
        .save()
        .then(() => {
          console.log('notesSubmit saved');
          this.set('notesSaveSuccess', true);
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 1 && text.length < 1) {
        return '';
      } else {
        return text.length >= 1;
      }
    },

    checkThis(toBeChecked) {
      jQuery('#' + toBeChecked)
        .prop('checked', true)
        .change();

      if (toBeChecked == 'inputPayoutBitcoin') {
        this.set('payoutIsBitcoin', true);
        this.set('inputPayoutType', 'bitcoin');
      } else if (toBeChecked == 'inputPayoutCheck') {
        this.set('payoutIsBitcoin', false);
        this.set('inputPayoutType', 'check');
      }
    },

    submitnotifySettings() {
      this.set('notifysettingsSaveStart', true);

      // Modify record pulled from db to variable
      this.model.user.set(
        'sendEmailFollowedOnline',
        this.sendEmailFollowedOnline
      );
      this.model.user.set(
        'privateMessageEmailNotifications',
        this.privateMessageEmailNotifications
      );
      this.model.user.set('sendEmailSiteNews', this.sendEmailSiteNews);

      // Save record to db
      this.model.user
        .save()
        .then(() => {
          console.log('submitnotifySettings saved');
          this.set('notifySettingsSaveSuccess', true);
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
          this.model.user.rollbackAttributes();
        });
    },

    submitSiteSettings() {
      this.set('siteSettingsSaveStart', true);

      // Modify record pulled from db to variable
      this.model.user.set('timezone', this.inputTimeZone);
      console.log('timezone: ' + this.inputTimeZone);

      // Save record to db
      this.model.user
        .save()
        .then(() => {
          console.log('submitSiteSettings saved');
          this.set('siteSettingsSaveSuccess', true);
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
          this.model.user.rollbackAttributes();
        });
    },

    submitPayoutSettings() {
      this.set('payoutSettingsSaveStart', true);
      // Get current state of setting from page and set to a variable
      var payoutMethod = this.inputPayoutType;
      var bitcoinAddress = this.inputbitcoinaddress;
      var address1 = this.inputaddress1;
      var address2 = this.inputaddress2;
      var city = this.inputCity;
      var region = this.inputRegion;
      var zipcode = this.inputZipcode;
      var country = this.inputCountry;
      var address3 = city + '|' + region + '|' + zipcode + '|' + country;

      // Modify record pulled from db
      this.model.contractorApplication.set('addressLine1', address1);
      this.model.contractorApplication.set('addressLine2', address2);
      this.model.contractorApplication.set('addressLine3', address3);
      this.model.contractorApplication.set('payoutMethod', payoutMethod);
      this.model.contractorApplication.set('bitcoinAddress', bitcoinAddress);

      // Save record to db
      this.model.contractorApplication
        .save()
        .then(() => {
          console.log('submitPayoutSettings saved');
          this.set('payoutSettingsSaveSuccess', true);
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
          this.model.contractorApplication.rollbackAttributes();
        });
    },

    submitEmailChange() {
      this.set('emailSaveStart', true);
      if (
        this.get('inputnewemailAddress') ==
        this.get('inputnewemailAddressConfirm')
      ) {
        // Modify record pulled from db to variable
        this.model.user.set('email', this.get('inputnewemailAddress'));
        this.model.user.set(
          'currentPassword',
          this.get('inputEmailCurrentPassword')
        );
        // Save record to db
        this.model.user
          .save()
          .then(() => {
            this.notify.success(
              'Your email address has been changed, please check for a confirmation email to complete the process.'
            );
            console.log('submitEmailChange saved');
            this.set('emailSaveSuccess', true);
          })
          .catch(err => {
            console.log('error saving user record:', err);
            this.errorHandler.handleWithNotification(err);
            this.model.user.rollbackAttributes();
          });
      } else {
        this.notify.error('The email fields must match.');
      }
    },

    submitPasswordChange() {
      this.set('passwordSaveStart', true);
      if (this.get('inputnewpassword') == this.get('inputpasswordconfirm')) {
        // Modify record pulled from db to variable
        this.model.user.set('password', this.get('inputnewpassword'));
        this.model.user.set(
          'currentPassword',
          this.get('inputPasswordCurrentPassword')
        );
        // Save record to db
        this.model.user
          .save()
          .then(() => {
            this.currentUser.logIn(
              this.get('session.data.authenticated.login'),
              this.get('inputnewpassword')
            );
            this.notify.success('Your password has been changed.');
            console.log('submitPasswordChange saved');
            this.set('passwordSaveSuccess', true);
          })
          .catch(err => {
            console.log('error saving user record:', err);
            this.errorHandler.handleWithNotification(err);
            this.model.user.rollbackAttributes();
          });
      } else {
        this.notify.error('The password fields must match.');
      }
    }
  }
});
