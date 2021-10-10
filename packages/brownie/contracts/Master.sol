//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Enumerable} from "./NFT.sol";
import {ReentrancyGuard} from "./NFT.sol";
import {Ownable} from "./NFT.sol";
import {Base64} from "./NFT.sol";
import {ERC721} from "./NFT.sol";

contract Master is ERC721Enumerable, ReentrancyGuard, Ownable {
    
     ItemSet[] public itemSets;
    ColorSet[] public colorSets;
    uint256 counter = 1;
    mapping (address => ItemSet) userToItems;
    mapping (address => uint256) public numItemsSets;
    mapping (uint256 => uint256) public tokenIdToRand;
    mapping (address => uint256) public userToMinted;
    mapping (address => uint256) public collectedFees;


    constructor() ERC721("Loot", "LOOT") Ownable() {
        ColorSet memory colorSet1;
        colorSet1.color1 = "red";
        colorSet1.color2 = "orange";
        colorSet1.color3 = "yellow";
        colorSets.push(colorSet1);

        ColorSet memory colorSet2;
        colorSet2.color1 = "green";
        colorSet2.color2 = "teal";
        colorSet2.color3 = "blue";
        colorSets.push(colorSet2);

        ColorSet memory colorSet3;
        colorSet3.color1 = "purple";
        colorSet3.color2 = "mediumslateblue";
        colorSet3.color3 = "plum";
        colorSets.push(colorSet3);

        ColorSet memory colorSet4;
        colorSet4.color1 = "deepskyblue";
        colorSet4.color2 = "royalblue";
        colorSet4.color3 = "midnightblue";
        colorSets.push(colorSet4);
    }

    struct ItemSet {
    string theme;
    string[] weapons;
    string[] attire;
    string[] accessories;
    ColorSet colorSet;
    address payable creator;
  }

  struct ColorSet {
      string color1;
      string color2;
      string color3;
  }


    event feeCollected(address to, uint256 fee);

    string[] private suffixes = ["Of Power", "Of The Sovereign", "Of The Future", "Of the Unknown", "Of the Singularity", "Of The Aeon", "Of Fragmentation", "Of Consciousness", "Of Vectors", "Of Augmentation", "Of The Holy", "Of The Dead", "Of The Living", "Of The Spirit", "Of Flames", "Of The Sigil", "Of The Quick", "Of The Mind", "Of The Fractals", "Of The Mysterious", "Of The Cryptographic", "Of Death", "Of Vitality", "Of Hope", "Of Reasoning", "Of Hysteria"];
    
    string[] private namePrefixes = ["Augmentation", "Cybernetic", "Nano", "Sharp", "Enhancement", "Modified", "Upgraded", "Advanced", "Hyper", "Ensured", "Proto", "Prototype", "Adaptation", "Artificial", "Genetic", "Carbon", "Bio", "Biomechanical", "Mechanized", "Machine", "Cyborg", "Artificial", "Autonomous", "Electric", "Electronic", "Reflective", "Reflexive", "Self-Aware", "Sentient", "Self-Morphing", "Self-Modifying", "Self-Learning", "Organic", "Omni", "Omni-Processing", "Dystopian", "Reactive", "Responsive", "Optimized", "Indestructible", "Visionary", "Holographic", "Neon", "Superfluid", "Translucent", "Invisible", "Impenetrable", "Incorporeal", "Morphing", "Shapeshifter", "Active", "Living", "Mysterious", "Immortal", "Re-animated", "Toxic", "Corrosive", "Explosive", "Flammable", "Pyro", "Combustible", "Self-Destructive", "Parasitic", "Viral", "Psionic", "Psychic", "Arcane", "Divine", "Alchemical", "Totemic", "Sentinel", "Defensive", "Recon"];
    
    string[] private nameSuffixes = ["Neon", "Stealthy", "Sentry", "Liberty", "Thunder", "Death", "Tool", "Junk", "Black", "Cyber", "Firewall", "Sharp", "Brawler", "Hacker", "Radiant", "Cipher", "Tracer", "Phantom", "Savage", "Persistent", "Serial", "Neural", "Deceit", "Lacquer", "Sapper", "Spark", "Spanner", "Scumbag", "Techno", "Cybernetics", "Shadow", "Transcendent", "Juggernaut", "Retro", "Metallic", "Chemical", "Spectral", "Digital", "Berserker", "Photon", "Anarchy", "Carbon", "Cyanide", "Hypnotic", "Decryptor", "Ghost", "Burly", "Agile"];
    
    function addItemSet(string memory _theme, string[] memory _weapons, string[] memory _attire, string[] memory _accessories) public payable {
        require(msg.value >= 50000000000000000, "Fee too low");
        uint256 rand = random(string(abi.encodePacked(_theme)));
        uint i = rand % colorSets.length;
        ColorSet memory colors = colorSets[i];

        ItemSet memory newItem;
        newItem.weapons = _weapons;
        newItem.attire = _attire;
        newItem.accessories = _accessories;
        newItem.theme = _theme;
        newItem.colorSet = colors;
        newItem.creator = payable(msg.sender);

        numItemsSets[msg.sender] += 1;
        itemSets.push(newItem);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    
    function getWeapon(uint256 tokenId, string[] memory weapons) public view returns (string memory) {
        return pluck(tokenId, "WEAPON", weapons);
    }
    
    function getAttire(uint256 tokenId, string[] memory attire) public view returns (string memory) {
        return pluck(tokenId, "ATTIRE", attire);
    }
    
    function getAccessories(uint256 tokenId, string[] memory accessories) public view returns (string memory) {
        return pluck(tokenId, "ACCESSORIES", accessories);
    }
    
    function pluck(uint256 tokenId, string memory keyPrefix, string[] memory sourceArray) internal view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked(keyPrefix, toString(tokenId))));
        string memory output = sourceArray[rand % sourceArray.length];
        uint256 greatness = rand % 21;
        if (greatness > 14) {
            output = string(abi.encodePacked(output, " ", suffixes[rand % suffixes.length]));
        }
        if (greatness >= 19) {
            string[2] memory name;
            name[0] = namePrefixes[rand % namePrefixes.length];
            name[1] = nameSuffixes[rand % nameSuffixes.length];
            if (greatness == 19) {
                output = string(abi.encodePacked('"', name[0], ' ', name[1], '" ', output));
            } else {
                output = string(abi.encodePacked('"', name[0], ' ', name[1], '" ', output, " +1"));
            }
        }
        return output;
    }

    function tokenURI(uint256 tokenId) override public view returns (string memory) {
        uint256 i = tokenIdToRand[tokenId];
        string[] memory weapons = itemSets[i].weapons;
        string[] memory attire = itemSets[i].attire;
        string[] memory accessories = itemSets[i].accessories;
        ColorSet memory colorSet = itemSets[i].colorSet;

        string[14] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: url(#linear-gradient); font-family: Impact; font-size: 18px; fontWeight: bold; }</style><defs><linearGradient id="linear-gradient" x1="0" x2="0" y1="0" y2="100%" gradientUnits="userSpaceOnUse"><stop stop-color="';
        parts[1] = colorSet.color1;
    
        parts[2] = '" offset="0%"/><stop stop-color="';
        
        parts[3] = colorSet.color2;
        
        parts[4] = '" offset="33%"/><stop stop-color="';
        
        parts[5] = colorSet.color3;
        
        parts[6] = '" offset="100%"/></linearGradient></defs><rect width="100%" height="100%" fill="black" /><text x="10" y="30" class="base">';
      
        parts[7] = getWeapon(tokenId, weapons);

        parts[8] = '</text><text x="10" y="60" class="base">';

        parts[9] = getAttire(tokenId, attire);

        parts[10] = '</text><text x="10" y="90" class="base">';

        parts[11] = getAccessories(tokenId, accessories);

        parts[12] = '</text><text x="10" y="120" class="base">';

        parts[13] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
        output = string(abi.encodePacked(output, parts[8], parts[9], parts[10], parts[11], parts[12], parts[13]));
        
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag #', toString(tokenId), '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function tokenImage(uint256 tokenId) public view returns (string memory) {
        uint256 i = tokenIdToRand[tokenId];
        string[] memory weapons = itemSets[i].weapons;
        string[] memory attire = itemSets[i].attire;
        string[] memory accessories = itemSets[i].accessories;
        ColorSet memory colorSet = itemSets[i].colorSet;
        string[14] memory parts;

        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: url(#linear-gradient); font-family: Impact; font-size: 18px; fontWeight: bold; }</style><defs><linearGradient id="linear-gradient" x1="0" x2="0" y1="0" y2="100%" gradientUnits="userSpaceOnUse"><stop stop-color="';
        parts[1] = colorSet.color1;
    
        parts[2] = '" offset="0%"/><stop stop-color="';
        
        parts[3] = colorSet.color2;
        
        parts[4] = '" offset="33%"/><stop stop-color="';
        
        parts[5] = colorSet.color3;
        
        parts[6] = '" offset="100%"/></linearGradient></defs><rect width="100%" height="100%" fill="black" /><text x="10" y="30" class="base">';
      
        parts[7] = getWeapon(tokenId, weapons);

        parts[8] = '</text><text x="10" y="60" class="base">';

        parts[9] = getAttire(tokenId, attire);

        parts[10] = '</text><text x="10" y="90" class="base">';

        parts[11] = getAccessories(tokenId, accessories);

        parts[12] = '</text><text x="10" y="120" class="base">';

        parts[13] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7]));
        output = string(abi.encodePacked(output, parts[8], parts[9], parts[10], parts[11], parts[12], parts[13]));
        output = Base64.encode(bytes(output));
        return output;
    }

    function claim() public payable nonReentrant {
        require(msg.value >= 50000000000000000, "Fee to low");
        uint256 tokenId = counter;
        uint256 rand = random(string(abi.encodePacked("GPT", toString(tokenId))));
        uint i = rand % itemSets.length;
        address payable creator = itemSets[i].creator;
        uint256 creatorFee = msg.value / 2;
        creator.transfer(creatorFee);
        tokenIdToRand[tokenId] = i;
        userToMinted[creator] += 1;
        collectedFees[creator] += creatorFee;
        creator.transfer(creatorFee);
        counter += 1;
        _safeMint(_msgSender(), tokenId);
        emit feeCollected(creator, creatorFee);
    }

    function withdrawFees() public onlyOwner {

      payable(msg.sender).transfer(address(this).balance);
  }
    

    function toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
}

