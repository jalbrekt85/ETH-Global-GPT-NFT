import pytest
from brownie import Consumer, config, network, interface

@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


@pytest.fixture
def account(accounts):
    return accounts[0]

@pytest.fixture
def deployed(account):
    deployed = Consumer.deploy({'from': account})
    link_token_address = config['networks'][network.show_active()]['link']
    amount = 1 * 10**18 # 1 Link token
    # Transfer Link to fund Consumer Contract for API calls
    token = interface.IERC20(link_token_address)
    token.transfer(deployed.address, amount, {'from': account})
    deployed.requestBytes("hello", {'from': account, 'value': 10000})
    return deployed