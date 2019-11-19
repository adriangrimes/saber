import requests
import time

# payload = {"user":{"password":"12345672","login":"testuser1"}}
payload = {"data":{"id":"4","type":"users","attributes":{"username":"UserTester1","email":"usertester1@email.com","broadcaster":False,"developer":False,"affiliate":False,"security_questions":None,"stream_key":None,"dark_mode":True,"send_email_favorites_online":True,"send_email_site_news":False,"private_message_email_notifications":False,"full_name":"User1 K1 Basic1","birthdate":None,"address_line1":None,"address_line2":None,"address_line3":"undefined|undefined|undefined|undefined","business_name":None,"business_entity_type":None,"payout_method":None,"bitcoin_address":None,"bank_account_number":None,"bank_routing_number":None,"subject_to_backup_withholding":False,"uploaded_identification":[{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBEUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--97710756afe859a51625df1932507717d3ca205e","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBEUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--97710756afe859a51625df1932507717d3ca205e/ffxiv_04072018_202718.png","filename":"ffxiv_04072018_202718.png","delete":False},{"signed_id":"eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBEZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--36c61897586dbaded8c382caec75b99c6349e125","file_url":"http://localhost:3000/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBEZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--36c61897586dbaded8c382caec75b99c6349e125/ffxiv_04072018_202721.png","filename":"ffxiv_04072018_202721.png","delete":False}]},"relationships":{"user_public_datum":{"data":{"id":"4","type":"user_public_data"}}}},"included":[{"id":"4","type":"user_public_data","attributes":{"user_id":4,"username":"UserTester1","online_status":None,"channel_topic":None,"current_game_id":None,"streamnail_path":None,"allow_tips":False, "allow_suggested_games":False,"timezone":None,"user_custom_tags":"","profile_photo_id":None,"profile_gender":"sdfg","profile_about_me":"dsfsdfgsdfgs","profile_age":48443,"profile_location":"sdfgsdfgasdfa","profile_languages":"sdfgsdfgasdfa"}}]}
# number = 0
# payload = {"data":{"attributes":{"username":"spamsignup"+str(number),"email":"grimzer+test"+str(number)+"@gmail.com","password":"asdfasdf","broadcaster":False,"developer":False,"affiliate":False,"security_questions":None,"stream_key":None,"dark_mode":False,"send_email_favorites_online":False,"send_email_site_news":False,"private_message_email_notifications":False,"full_name":None,"birthdate":None,"address_line1":None,"address_line2":None,"address_line3":None,"business_name":None,"business_entity_type":None,"payout_method":None,"bitcoin_address":None,"bank_account_number":None,"bank_routing_number":None,"subject_to_backup_withholding":False,"uploaded_identification":[]},"type":"users"}}

headers = {'Authorization': 'Token token="urbrhAyWDjEgrzbbyers", email="usertester1@email.com"'}
#headers = {'Content-Type': 'application/vnd.api+json'}
#r = requests.post('http://localhost:3000/users/sign_in', json=payload)
r = requests.get('http://localhost:3000/chat_tickets?identifier=localhost')
# r = requests.patch('http://localhost:3000/users/4', headers=headers, json=payload)
# while 1 < 2:
    # time.sleep(0.2)
    # r = requests.get('http://localhost:3000/user_public_data')
    # r = requests.patch('http://localhost:3000/users/4', headers=headers, json=payload)
    # number += 1
    # print('creating account')
    # print(number)
    # payload = {"data":{"attributes":{"username":"spamsignup"+str(number),"email":"grimzer+test"+str(number)+"@gmail.com","password":"asdfasdf","broadcaster":False,"developer":False,"affiliate":False,"security_questions":None,"stream_key":None,"dark_mode":False,"send_email_favorites_online":False,"send_email_site_news":False,"private_message_email_notifications":False,"full_name":None,"birthdate":None,"address_line1":None,"address_line2":None,"address_line3":None,"business_name":None,"business_entity_type":None,"payout_method":None,"bitcoin_address":None,"bank_account_number":None,"bank_routing_number":None,"subject_to_backup_withholding":False,"uploaded_identification":[]},"type":"users"}}


#eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBNdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--42af6bb3d770a4bb1fb2199e5102058fd3d3185e
print(r.status_code)
print(r.text)
#print(r.json())
