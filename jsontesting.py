import requests

payload = {"user":{"password":"12345672","login":"testuser1"}}

headers = {'Authorization': 'Token token="soMsCMN_cRTWrVZS1eTj", email="usertester1@email.com"'}
#headers = {'Content-Type': 'application/vnd.api+json'}
#r = requests.post('http://localhost:3000/users/sign_in', json=payload)
r = requests.get('http://localhost:3000/users/4', headers=headers)
print(r.status_code)
print(r.text)
#print(r.json())
