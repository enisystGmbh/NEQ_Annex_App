from requests import session

username = 'neele.kemper'
password = 'test'

with session() as s:
    formData = {
        'log' : username,
        'pwd' : password,
        'submit' : 'Log In',
        'redirect_to' : 'https://deveniserv.de',
        'testcookie' : 1
    }
    request = s.post('https://deveniserv.de/login/', data = formData)
    dic = request.headers
    print(dic)

    """
    values = open('payload.json').read()

    response = s.put("https://eniserv.de/enilyser/005056333BB8/REST/DemonstratorAvat/devices/ez0/schedule", data = values)

    print(response.status_code) 

    response = s.get("https://eniserv.de/enilyser/005056333BB8/REST/DemonstratorAvat/devices/ez0/schedule")

    print(response.status_code)     
    """