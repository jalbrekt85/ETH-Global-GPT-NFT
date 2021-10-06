from brownie import accounts, config, network, Consumer, interface, Gpt

# Set key in brownie config
account = accounts.add(config['wallets']['from_key'])
print(network.show_active())

def main():
    deployed = Consumer.deploy({'from': account})
    # deployed = Gpt.deploy({'from': account})
    print('Deployed By: ', account.address, '\nAt: ', deployed.address)
    link_token_address = config['networks'][network.show_active()]['link']
    amount = 0.1 * 10**18 # 1 Link token
    transfer_token(link_token_address, deployed.address, amount)

    # deployed.requestBytes("Mafia", {'from': account})

    # deployed.withdrawLink({'from' : account})
    return deployed, account

def transfer_token(token_address, to_address, amount):
    token = interface.IERC20(token_address)
    token.transfer(to_address, amount, {'from': account})
    print(f'Transfered {amount} to {to_address}')