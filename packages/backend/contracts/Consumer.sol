//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "../interfaces/IERC20.sol";

contract Consumer is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  string public weapons;
  string public attire;
  string public accessories;
  uint public fee = 1000;
  mapping  (bytes32 => address) public idToUser;
  mapping (address => bytes32) public userToId;
  mapping  (bytes32 => ItemSet) public idToItemSet;
  mapping (address => ItemSet) public userToItems;
  uint256 payment = 100000000000000;
  bytes32 specId = "b61b4d719ab04199882c6a8ac3c51861";

  struct ItemSet {
    string theme;
    string weapons;
    string armor;
    string accessories;
  }

  constructor(
  ) {
    setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
    setChainlinkOracle(0x45Fd8dF7E9348b14AfC145599F719DbE27977Fd9);
    
  }

  function requestBytes(string memory _prompt
  )
    public
    returns (bytes32)
  {
    // require(msg.value >= fee, "Include fee in transaction");
    // require(IERC20(0xa36085F69e2889c224210F603D836748e7dC0088).balanceOf(address(this)) >= payment, "Not enough link");
    Chainlink.Request memory req = buildChainlinkRequest(specId, address(this), this.fulfill.selector);
    req.add("prompt", _prompt);

    // bytes32 reqId = sendChainlinkRequestTo(0x45Fd8dF7E9348b14AfC145599F719DbE27977Fd9, req, payment);
    // idToUser[reqId] = msg.sender;
    bytes32 id = requestOracleData(req, payment);
    idToUser[id] = msg.sender;
    userToId[msg.sender] = id;
 
  }



  event Response(bytes32 Id);

  
  function fulfill(
    bytes32 requestId,
    bytes memory _weapons,
    bytes memory _attire,
    bytes memory _accessories
  )
    public
    recordChainlinkFulfillment(requestId)
  {
    emit Response(requestId);
    ItemSet memory items;
    items.theme = "";
    items.weapons = string(_weapons);
    items.armor = string(_attire);
    items.accessories = string(_accessories);
    address requester = idToUser[requestId];
    userToItems[requester] = items;

  }
 
  
  function withdrawLink() public {
    uint256 bal = IERC20(0xa36085F69e2889c224210F603D836748e7dC0088).balanceOf(address(this));
    IERC20(0xa36085F69e2889c224210F603D836748e7dC0088).transfer(msg.sender, bal);
  }
  
  receive() external payable {}

}
