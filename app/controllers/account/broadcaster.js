import Controller from '@ember/controller';
//import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  daysList:[
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
  ],
  monthsList:[
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  yearsList:[
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
    '2011',
    '2010',
    '2009',
    '2008',
    '2007',
    '2006',
    '2005',
    '2004',
    '2003',
    '2002',
    '2001',
    '2000',
    '1999',
    '1998',
    '1997',
    '1996',
    '1995',
    '1994',
    '1993',
    '1992',
    '1991',
    '1990',
    '1989',
    '1988',
    '1987',
    '1986',
    '1985',
    '1984',
    '1983',
    '1982',
    '1981',
    '1980',
    '1979',
    '1978',
    '1977',
    '1976',
    '1975',
    '1974',
    '1973',
    '1972',
    '1971',
    '1970',
    '1969',
    '1968',
    '1967',
    '1966',
    '1965',
    '1964',
    '1963',
    '1962',
    '1961',
    '1960',
    '1959',
    '1958',
    '1957',
    '1956',
    '1955',
    '1954',
    '1953',
    '1952',
    '1951',
    '1950',
    '1949',
    '1948',
    '1947',
    '1946',
    '1945',
    '1944',
    '1943',
    '1942',
    '1941',
    '1940',
    '1939',
    '1938',
    '1937',
    '1936',
    '1935',
    '1934',
    '1933',
    '1932',
    '1931',
    '1930',
    '1929',
    '1928',
    '1927',
    '1926',
    '1925',
    '1924',
    '1923',
    '1922',
    '1921',
    '1920',
  ],


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
   setCountry(country){
     this.set('inputCountry', country);
     if (country =="United States"){
       this.set('isUSA', true);
     }else{
       this.set('isUSA', false);
     }

   },
   checkThis(toBeChecked){
     $("#"+toBeChecked).prop('checked', true).change();


   },
   checkBitcoin(toBeChecked){
     $("#"+toBeChecked).prop('checked', true).change();

     if(toBeChecked =="inputPayoutBitcoin"){
        this.set('payoutIsBitcoin', true);
     }else{
       this.set('payoutIsBitcoin', false);
     }

   },
   showEntityMenu(){
     console.log('is busines');
     this.set('isBusiness', true);

   },


   submitBroadcasterVerification(){

   },
   broadcasterSaveForLater(){
     // Get current state of setting from page and set to a variable
     var updateFirstName = this.get('inputfirstName');
     var updateMiddleName = this.get('inputmiddleName');
     var updateLastName = this.get('inputlastName');
     var updateMonth = this.get('inputMonth');
     var updateDay = this.get('inputDay');
     var updateYear = this.get('inputYear');
    var address1 = this.get('inputaddress1');
    var address2 = this.get('inputaddress2');
    var city = this.get('inputCity');
    var region = this.get('inputRegion');
    var zipcode = this.get('inputZipcode');
    var country = this.get('inputCountry');
    var address3 = (city+'|'+region+'|'+zipcode+'|'+country);
    var dateofbirth = new Date(updateMonth+" "+updateDay+", "+updateYear);
    console.log(dateofbirth);


     this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

       // Modify record pulled from db to variable
       user.set('firstName', updateFirstName);
       user.set('middleName', updateMiddleName);
       user.set('lastName', updateLastName);
       user.set('birthdate', dateofbirth);
       user.set('addressLine1', address1);
       user.set('addressLine2', address2);
       user.set('addressLine3', address3);

       // Save record to db
       user.save().then(() => {
         console.log('broadcasterSaveForLater saved');
         $('[id=broadcasterSaveForLater]').text('');
         $('[id=broadcasterSaveForLater]').addClass('fa fa-check');
       }).catch((reason) => {
         console.log('error saving user record: ' + reason);
         this.set('errorMessage', reason.error || reason);
       });
     }).catch((reason) => {
       console.log('error finding user record: ' + reason);
       this.set('errorMessage', reason.error || reason);
     });


   },
  }

});
