import requests

# payload = {"user":{"password":"12345672","login":"testuser1"}}
# payload = {"data":{"id":"4","attributes":{"username":"UserTester1","email":"usertester1@email.com","password": None,"broadcaster":False,"developer":False,"affiliate":False,"security_questions":None,"stream_key":None,"dark_mode":False,"send_email_favorites_online":False,"send_email_site_news":True,"private_message_email_notifications":True,"full_name":"User1 K1 Basic1","birthdate":"1991-07-05T07:00:00.000Z","address_line1":"Adress Line 1 From Formasdasd","address_line2":"AddressLine2FromForm","address_line3":"CityFrom Form|STATEFARM|99016|United States","business_name":"BusinessNameFromForm","business_entity_type":"Other|OtherEntityFromForm","payout_method":"bitcoin","bitcoin_address":"TOtallyLegitBitcoinAddress","bank_account_number":None,"bank_routing_number":None,"subject_to_backup_withholding":True,"uploaded_identification":[{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBWZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e031324fa89d684aad8d6f0798c54e7b97b4bc0b","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBWZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e031324fa89d684aad8d6f0798c54e7b97b4bc0b/come%20at%20me.png","filename":"come at me.png","delete":False},{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d4199398de5432ec121d181ac28cabb05bce904a","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--d4199398de5432ec121d181ac28cabb05bce904a/ffxiv_03122017_145245.png","filename":"ffxiv_03122017_145245.png","delete":False},{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4ef5c412002d5a6727e75dfc714b6b662c789357","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4ef5c412002d5a6727e75dfc714b6b662c789357/ffxiv_03122017_145240.png","filename":"ffxiv_03122017_145240.png","delete":False},{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBNdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--42af6bb3d770a4bb1fb2199e5102058fd3d3185e","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBkZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5a1d4c325fb2e82c8e0deb772628af2802f2938c/ffxiv_03122017_145245.png","filename":"ffxiv_03122017_145245.png","delete":False}]},"relationships":{"user_public_datum":{"data":{"type":"user-public-data","id":"4"}}},"type":"users"}}

headers = {'Authorization': 'Token token="D7-EvymzN4A3nWdKCrsS", email="usertester1@email.com"'}
#headers = {'Content-Type': 'application/vnd.api+json'}
#r = requests.post('http://localhost:3000/users/sign_in', json=payload)
# r = requests.get('http://localhost:3000/users/4', headers=headers)
r = requests.patch('http://localhost:3000/users/4', headers=headers, json=payload)


#eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBNdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--42af6bb3d770a4bb1fb2199e5102058fd3d3185e
print(r.status_code)
print(r.text)
#print(r.json())
