
def test_input(deployed, account):
    deployed.requestBytes("hello", {'from': account, 'value': 10000})