from brownie import accounts, config, network, Master, Contract
import math
# Set key in brownie config
acct = accounts.add(config['wallets']['from_key'])
print(network.show_active())


def main():
    deployed = Master.deploy({'from': acct})
    # deployed = Contract("0x2bFF4244783eceE98cD8D24712E860c19ef0A661")
    return deployed, acct
