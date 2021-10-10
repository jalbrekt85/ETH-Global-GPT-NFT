from brownie import accounts, config, network, Consumer, interface, Contract

# Set key in brownie config
account = accounts.add(config['wallets']['from_key'])
print(network.show_active())

def main():
    deployed = Consumer.deploy({'from': account})
    print('Deployed By: ', account.address, '\nAt: ', deployed.address)
    link_token_address = "0xb0897686c545045aFc77CF20eC7A532E3120E0F1"
    amount = 0.001 * 10**18 
    transfer_token(link_token_address, deployed.address, amount)


    # deployed.withdrawLink({'from' : account})
    # deployed.requestBytes("Mafia", {'from': account})
    return deployed, account

def transfer_token(token_address, to_address, amount):
    token = interface.IERC20(token_address)
    token.transfer(to_address, amount, {'from': account})
    print(f'Transfered {amount} to {to_address}')