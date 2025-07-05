// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Tiles } from "./Tiles.sol";

/// @title Gatherers – ASCII-tile mapping NFT
/// @notice MVP contract for the 10×10 grid with random position minting
contract Gatherers is ERC721Enumerable, Ownable {
    /*//////////////////////////////////////////////////////////////
                               CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint8  public constant GRID_SIZE        = 10;          // 10 × 10 grid
    uint256 public constant MAX_SUPPLY      = GRID_SIZE * GRID_SIZE; // 100
    uint8  public constant TREASURY_RESERVE = 3;           // first 3 tokens pre-minted

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    // Mapping to track if a position is minted
    mapping(uint256 => bool) private _positionMinted;
    
    // Counter for remaining positions
    uint256 private _remainingPositions;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address treasury) ERC721("Gatherers", "GTHR") Ownable(msg.sender) {
        _remainingPositions = MAX_SUPPLY;
        
        // Pre-mint the treasury reserve randomly
        for (uint8 i; i < TREASURY_RESERVE; i++) {
            uint256 randomPosition = _getRandomPosition(block.timestamp + i);
            _positionMinted[randomPosition] = true;
            _remainingPositions--;
            _safeMint(treasury, randomPosition);
        }
    }

    /*//////////////////////////////////////////////////////////////
                          COORD ↔ TOKEN ID HELPERS
    //////////////////////////////////////////////////////////////*/

    function _coordsToId(uint8 x, uint8 y) public pure returns (uint256) {
        require(x < GRID_SIZE && y < GRID_SIZE, "OOB");
        return uint256(x) * GRID_SIZE + y; // 0-99 unique id
    }

    function _idToCoords(uint256 id) public pure returns (uint8 x, uint8 y) {
        require(id < MAX_SUPPLY, "BAD_ID");
        x = uint8(id / GRID_SIZE);
        y = uint8(id % GRID_SIZE);
    }

    /*//////////////////////////////////////////////////////////////
                            RANDOM POSITION
    //////////////////////////////////////////////////////////////*/

    function _getRandomPosition(uint256 seed) internal view returns (uint256) {
        require(_remainingPositions > 0, "NO_POSITIONS");
        
        // Generate a random index
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            seed,
            msg.sender
        ))) % MAX_SUPPLY;
        
        // Find the next available position
        uint256 position = randomIndex;
        while (_positionMinted[position]) {
            position = (position + 1) % MAX_SUPPLY;
        }
        
        return position;
    }

    /*//////////////////////////////////////////////////////////////
                                MINTING
    //////////////////////////////////////////////////////////////*/

    /// @notice Free mint at a random available position
    function mint() external {
        require(_remainingPositions > 0, "NO_POSITIONS");
        
        uint256 position = _getRandomPosition(block.timestamp);
        _positionMinted[position] = true;
        _remainingPositions--;
        
        _safeMint(msg.sender, position);
    }

    /// @notice Free mint at specific coordinates if available
    function mintAt(uint8 x, uint8 y) external {
        uint256 tokenId = _coordsToId(x, y);
        require(!_positionMinted[tokenId], "POSITION_TAKEN");
        
        _positionMinted[tokenId] = true;
        _remainingPositions--;
        
        _safeMint(msg.sender, tokenId);
    }

    /*//////////////////////////////////////////////////////////////
                              TOKEN METADATA
    //////////////////////////////////////////////////////////////*/

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        (uint8 x, uint8 y) = _idToCoords(tokenId);

        string memory svgB64 = _svgForToken(tokenId);

        string memory json = string.concat(
            '{"name":"Gatherers Tile (', _toString(x), ',', _toString(y), ')",',
            '"description":"ASCII map tile from Gatherers.",',
            '"attributes":[{"trait_type":"x","value":"', _toString(x),
            '"},{"trait_type":"y","value":"', _toString(y),'"}],',
            '"image":"data:image/svg+xml;base64,', svgB64, '"}'
        );

        return string.concat("data:application/json;base64,", _base64(bytes(json)));
    }

    function _blankYellowSvg() internal pure returns (string memory) {
        // 100×100 yellow rectangle in brand colour (#FFD500) with black stroke
        bytes memory svg = bytes(
            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="background:#FFD500"><rect width="100" height="100" stroke="#000" fill="#FFD500"/></svg>'
        );
        return _base64(svg);
    }

    function _svgForToken(uint256 tokenId) internal pure returns (string memory) {
        string memory ascii = Tiles.tile(tokenId);

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" style="background:#FFD500">',
            '<text x="10" y="20" font-family="', Tiles.FONT, '" font-size="16" fill="#000" xml:space="preserve">',
            ascii,
            '</text></svg>'
        );
        return _base64(svg);
    }

    /*//////////////////////////////////////////////////////////////
                                UTILITIES
    //////////////////////////////////////////////////////////////*/

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
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

    bytes internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function _base64(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        string memory table = string(TABLE);
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        assembly {
            mstore(result, encodedLen)
            let tablePtr := add(table, 1)
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            let resultPtr := add(result, 32)
            for { } lt(dataPtr, endPtr) { } {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        return result;
    }
} 