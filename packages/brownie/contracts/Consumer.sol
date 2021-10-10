// //SPDX-License-Identifier: MIT
// pragma solidity ^0.8.6;

// import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/ChainlinkClient.sol";


// contract Consumer is ChainlinkClient {
//   using Chainlink for Chainlink.Request;


//   mapping  (bytes32 => address) public idToUser;
//   mapping (address => bytes32) public userToId;
//   mapping  (bytes32 => ItemSet) public idToItemSet;
//   mapping (address => ItemSet) public userToItems;
//   uint public fee = 10000000000000000;
  
//   uint256 payment = 100000000000000;
//   bytes32 specId = "2bfad19ddf6b48dc9f9ecd6f6125ca5f";
//   address oracle = 0x81011dACe2e5512c9cbB0C329316FfD1a4701BaD;
//   address payable owner = payable(0xA0c60A3Bf0934869f03955f3431E044059B03E62);

//   struct ItemSet {
//     string theme;
//     string weapons;
//     string armor;
//     string accessories;
//   }

//   constructor(
//   ) {
//     setChainlinkToken(0xb0897686c545045aFc77CF20eC7A532E3120E0F1);
//     setChainlinkOracle(0x81011dACe2e5512c9cbB0C329316FfD1a4701BaD);
    
//   }

//   function requestBytes(string memory _prompt
//   )
//     public
//     payable
//   {
//     require(msg.value >= fee, "request fee must be >= 0.01 MATIC");
    
//     Chainlink.Request memory req = buildOperatorRequest(specId, this.fulfill.selector);
//     req.add("prompt", _prompt);

   
//     bytes32 id = sendOperatorRequestTo(oracle, req, payment);
//     idToUser[id] = msg.sender;
//     userToId[msg.sender] = id;
 
//   }


//   event Response(bytes32 Id);

  
//   function fulfill(
//     bytes32 requestId,
//     bytes memory _weapons,
//     bytes memory _attire,
//     bytes memory _accessories
//   )
//     public
//     recordChainlinkFulfillment(requestId)
//   {
//     emit Response(requestId);
//     ItemSet memory items;
//     items.theme = "";
//     items.weapons = string(_weapons);
//     items.armor = string(_attire);
//     items.accessories = string(_accessories);
//     address requester = idToUser[requestId];
//     userToItems[requester] = items;

//   }
  
//     function withdrawLink() public {
//     require(msg.sender == owner, "not owner");
//     uint256 bal = IERC20(0xb0897686c545045aFc77CF20eC7A532E3120E0F1).balanceOf(address(this));
//     IERC20(0xb0897686c545045aFc77CF20eC7A532E3120E0F1).transfer(owner, bal);
//   }
  
//   function withdrawFees() public {
//       require(msg.sender == owner, "not owner");
//       owner.transfer(address(this).balance);
//   }
 
//   receive() external payable {}

// }

// interface IERC20 {
//   function balanceOf(address owner) external view returns (uint256 balance);
//   function transfer(address to, uint256 value) external returns (bool success);
// }
