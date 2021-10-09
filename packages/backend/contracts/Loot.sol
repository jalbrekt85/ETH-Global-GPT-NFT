//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Enumerable} from "./NFT.sol";
import {ReentrancyGuard} from "./NFT.sol";
import {Ownable} from "./NFT.sol";
import {Base64} from "./NFT.sol";
import {ERC721} from "./NFT.sol";

contract Loot is ERC721Enumerable, ReentrancyGuard, Ownable {
    
    string public theme;
    string[] public weapons;
    string[] public attire;
    string[] public accessories;
    uint256 numTokens;

    constructor(string memory _theme, string[] memory _weapons, string[] memory _attire, string[] memory _accessories, uint256 _numTokens) ERC721("Loot", "LOOT") Ownable() {
        theme = _theme;
        weapons = _weapons;
        attire = _attire;
        accessories = _accessories;
        numTokens = _numTokens;
    }

    string[] private suffixes = ["Of Power", "Of Dark Matter", "Of The Sovereign", "Of The Future", "Of the Unknown", "Of Gravity", "Of the Singularity", "Of Distant Suns", "Of Next Augmented", "Of The Aeon", "Of Micro Fragmentation", "Of Vicarious Consciousness", "Of Vectors", "Of Metaphysical Augmentation", "Of The Astral Planes", "Of The Living Universe", "Of The Biomechs", "Of The Cyborgs", "Of The Spiritual Planes", "Of The Nano Threads", "Of The Sigil", "Of The Quick", "Of The Mind", "Of Psychic Fractals", "Of The Genetic Codex"];
    
    string[] private namePrefixes = ["Augmentation", "Cybernetic", "Cyber", "Nano", "Implanted", "Enhancement", "Modified", "Upgraded", "Advanced", "Hyper", "Advanced", "Proto", "Prototype", "Adaptation", "Artificial", "Gene", "Genetic", "Carbon", "Bio", "Biomechanical", "Mechanized", "Machine", "Cyborg", "Artificial", "Autonomous", "Electric", "Electronic", "Reflective", "Reflexive", "Self-Aware", "Sentient", "Self-Morphing", "Self-Modifying", "Self-Learning", "Organic", "Omni", "Omni-Processing", "Dystopian", "Reactive", "Responsive", "Optimized", "Indestructible", "Visionary", "Holographic", "Neon", "Superfluid", "Translucent", "Invisible", "Impenetrable", "Incorporeal", "Morphing", "Shapeshifter", "Active", "Living", "Mysterious", "Immortal", "Re-animated", "Toxic", "Corrosive", "Explosive", "Flammable", "Pyro", "Combustible", "Self-Destructive", "Parasitic", "Viral", "Psionic", "Psychic", "Arcane", "Divine", "Alchemical", "Totemic", "Sentinel", "Defensive", "Recon"];
    
    string[] private nameSuffixes = ["Neon", "Stealthy", "Sentry", "Liberty", "Thunder", "Death", "Tool", "Junk", "Black", "Cyber", "Firewall", "Sharp", "Brawler", "Hacker", "Radiant", "Cipher", "Tracer", "Phantom", "Savage", "Persistent", "Serial", "Neural", "Deceit", "Lacquer", "Sapper", "Spark", "Spanner", "Scumbag", "Techno", "Cybernetics", "Shadow", "Transcendent", "Juggernaut", "Retro", "Metallic", "Chemical", "Spectral", "Digital", "Berserker", "Photon", "Anarchy", "Carbon", "Cyanide", "Hypnotic", "Decryptor", "Ghost", "Phoenix"];
    
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }
    
    function getWeapon(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "WEAPON", weapons);
    }
    
    function getAttire(uint256 tokenId) public view returns (string memory) {
        return pluck(tokenId, "ATTIRE", attire);
    }
    
    function getAccessories(uint256 tokenId) public view returns (string memory) {
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
        string[8] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = getWeapon(tokenId);

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getAttire(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getAccessories(tokenId);

        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
        output = string(abi.encodePacked(output, parts[7]));
        
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Bag #', toString(tokenId), '", "description": "Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Loot in any way you want.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function tokenImage(uint256 tokenId) public view returns (string memory) {
        string[8] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';

        parts[1] = getWeapon(tokenId);

        parts[2] = '</text><text x="10" y="40" class="base">';

        parts[3] = getAttire(tokenId);

        parts[4] = '</text><text x="10" y="60" class="base">';

        parts[5] = getAccessories(tokenId);

        parts[6] = '</text><text x="10" y="80" class="base">';

        parts[7] = '</text></svg>';

        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6]));
        output = string(abi.encodePacked(output, parts[7]));
        
        return output;
    }

    function claim(uint256 tokenId) public nonReentrant {
        require(tokenId > 0 && tokenId <= numTokens, "Token ID invalid");
        _safeMint(_msgSender(), tokenId);
    }
    
    function ownerClaim(uint256 tokenId) public nonReentrant onlyOwner {
        require(tokenId > numTokens && tokenId <= numTokens + 100, "Token ID invalid");
        _safeMint(owner(), tokenId);
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
