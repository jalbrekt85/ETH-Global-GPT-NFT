from bridge import Bridge
import json
import config
import binascii
from preprompt import templates

class Adapter:

    def __init__(self, input):
        self.base_url = "https://api.openai.com/v1/engines/davinci/completions"
        self.id = input.get('id', '1')
        self.request_data = input.get('data')
        if self.validate_request_data():
            self.bridge = Bridge()
            self.set_params()
            self.create_request()
        else:
            self.result_error('No data provided')

    def validate_request_data(self):
        if self.request_data is None:
            return False
        if self.request_data == {}:
            return False
        return True

    def set_params(self):
        self.prompt = self.request_data.get("prompt")
        self.item_type = self.request_data.get("itemType").strip()
        print('TYPE: ', self.item_type, 'Weapons' in self.item_type)
        self.template = templates[self.item_type]

    def create_request(self):
        print(self.template.format(self.prompt))
        try:
            headers={
    "Authorization": f"Bearer {config.API_KEY}",
    "Content-Type": 'application/json'
  }
            json={
                "prompt": self.template.format(self.prompt),
                "max_tokens": 50,
                "temperature": 0.70,
                "top_p": 1,
                "n": 1,
                "frequency_penalty": 0.05,
                "presence_penalty": 0.05,
                "stop": ["\n"]
            }
            response = self.bridge.request(self.base_url, json=json, headers=headers)
            data = response.json()['choices'][0]['text'][1:]
            print('Response: ', data)
           
            hex_data = binascii.hexlify(data.encode('utf8'))
            bytes_data = '0x' + str(hex_data)[2:-1]
            self.result = bytes_data
            self.result_success(bytes_data)
        except Exception as e:
            self.result_error(e)
        finally:
            self.bridge.close()

    def result_success(self, data):
        self.result = {
            'jobRunID': self.id,
            'data': data,
            'result': self.result,
            'statusCode': 200,
        }

    def result_error(self, error):
        self.result = {
            'jobRunID': self.id,
            'status': 'errored',
            'error': f'There was an error: {error}',
            'statusCode': 500,
        }
