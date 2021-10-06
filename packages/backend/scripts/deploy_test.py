from brownie import accounts, config, network, Master
import math
# Set key in brownie config
acct = accounts.add(config['wallets']['from_key'])
print(network.show_active())


def main():
    deployed = Master.deploy({'from': acct})
    return deployed, acct
