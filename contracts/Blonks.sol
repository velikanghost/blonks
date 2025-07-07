// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/ASCIIPortraitLib.sol";

/**
 * @title Blonks
 * @dev An NFT collection that generates ASCII portraits based on wallet addresses
 * and evolves over time based on block numbers
 */
contract Blonks is ERC721Enumerable, ReentrancyGuard, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 500;
    uint256 private _currentTokenId;

    // Mapping from token ID to original minter address
    mapping(uint256 => address) public originalMinter;

    // Mapping to track which addresses have already minted
    mapping(address => bool) public hasMinted;

    uint256 public constant MINT_PRICE = 0.1 ether;

    constructor() ERC721("Blonks", "BLONK") Ownable(msg.sender) {}

    /**
     * @dev Mint a new portrait NFT - limited to one per wallet
     */
    function mint() external payable nonReentrant {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_currentTokenId < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[msg.sender], "Address has already minted");

        uint256 tokenId = _currentTokenId + 1;
        _currentTokenId = tokenId;

        hasMinted[msg.sender] = true;
        originalMinter[tokenId] = msg.sender;
        _safeMint(msg.sender, tokenId);
    }

    /**
     * @dev Check if an address has already minted
     */
    function hasAddressMinted(address user) external view returns (bool) {
        return hasMinted[user];
    }

    /**
     * @dev Generate the metadata JSON for a token
     */
    function _generateMetadata(
        uint256 tokenId,
        string memory encodedSvg
    ) internal view returns (string memory) {
        address minter = originalMinter[tokenId];
        uint256 variation = (block.number / 100) % 20;

        // Get last 3 characters of minter address
        string memory minterStr = Strings.toHexString(
            uint256(uint160(minter)),
            20
        );
        string memory addressSuffix = string(
            abi.encodePacked(
                bytes(minterStr)[39],
                bytes(minterStr)[40],
                bytes(minterStr)[41]
            )
        );

        // Get background type
        bytes32 bgSeed = keccak256(
            abi.encodePacked(minter, "background", block.number / 200)
        );
        uint256 bgType = uint256(bgSeed) % 3;
        string memory backgroundType;
        if (bgType == 0) {
            backgroundType = "Linear Gradient";
        } else if (bgType == 1) {
            backgroundType = "Radial Gradient";
        } else {
            backgroundType = "Solid Color";
        }

        // Get text color type
        bytes32 textSeed = keccak256(
            abi.encodePacked(minter, "textcolor", block.number / 200)
        );
        uint256 textType = uint256(textSeed) % 8;
        string memory textColorType;
        if (textType == 0) {
            textColorType = "Neon Mint";
        } else if (textType == 1) {
            textColorType = "Sunset";
        } else if (textType == 2) {
            textColorType = "Pastel Dream";
        } else if (textType == 3) {
            textColorType = "Pink Glow";
        } else if (textType == 4) {
            textColorType = "Lime Burst";
        } else if (textType == 5) {
            textColorType = "Peach Fade";
        } else if (textType == 6) {
            textColorType = "Aqua Mist";
        } else {
            textColorType = "Pure White";
        }

        // Check for special rare traits
        bytes32 specialSeed = keccak256(
            abi.encodePacked(minter, "special", tokenId)
        );
        uint256 specialRoll = uint256(specialSeed) % 100;

        string memory specialTraits = "";
        if (specialRoll < 1) {
            specialTraits = string(
                abi.encodePacked(
                    specialTraits,
                    ',{"trait_type":"Special","value":"Diamond Frame"}'
                )
            );
        } else if (specialRoll < 6) {
            specialTraits = string(
                abi.encodePacked(
                    specialTraits,
                    ',{"trait_type":"Special","value":"Golden Glow"}'
                )
            );
        }

        // Check for time-based rarity
        if (variation >= 18) {
            // Ultra rare variations (2 out of 20 = 10%)
            specialTraits = string(
                abi.encodePacked(
                    specialTraits,
                    ',{"trait_type":"Rarity","value":"Ultra Rare"}'
                )
            );
        } else if (variation >= 15) {
            // Rare variations (3 out of 20 = 15%)
            specialTraits = string(
                abi.encodePacked(
                    specialTraits,
                    ',{"trait_type":"Rarity","value":"Rare"}'
                )
            );
        }

        return
            string(
                abi.encodePacked(
                    '{"name":"Blonk #',
                    tokenId.toString(),
                    '","description":"An evolving ASCII portrait that changes over time based on block numbers.",',
                    '"image":"data:image/svg+xml;base64,',
                    encodedSvg,
                    '","attributes":[{"trait_type":"Blonk Variation","value":"',
                    variation.toString(),
                    '"},{"trait_type":"Background Type","value":"',
                    backgroundType,
                    '"},{"trait_type":"Text Color","value":"',
                    textColorType,
                    '"},{"trait_type":"Address Suffix","value":"',
                    addressSuffix,
                    '"}',
                    specialTraits,
                    "]}"
                )
            );
    }

    /**
     * @dev Generate a random background based on the token minter
     */
    function _generateBackground(
        address minter,
        uint256 blockNum
    ) internal pure returns (string memory) {
        bytes32 seed = keccak256(
            abi.encodePacked(minter, "background", blockNum / 200)
        );
        uint256 rand = uint256(seed);

        // Generate 3 different background types
        uint256 bgType = rand % 3;

        if (bgType == 0) {
            // Linear gradient backgrounds
            return _generateLinearGradient(seed);
        } else if (bgType == 1) {
            // Radial gradient backgrounds
            return _generateRadialGradient(seed);
        } else {
            // Solid color backgrounds
            return _generateSolidBackground(seed);
        }
    }

    /**
     * @dev Generate a linear gradient background
     */
    function _generateLinearGradient(
        bytes32 seed
    ) internal pure returns (string memory) {
        uint256 r1 = (uint256(keccak256(abi.encodePacked(seed, "r1"))) % 128) +
            20; // 20-147
        uint256 g1 = (uint256(keccak256(abi.encodePacked(seed, "g1"))) % 128) +
            20; // 20-147
        uint256 b1 = (uint256(keccak256(abi.encodePacked(seed, "b1"))) % 128) +
            20; // 20-147

        uint256 r2 = (uint256(keccak256(abi.encodePacked(seed, "r2"))) % 128) +
            20; // 20-147
        uint256 g2 = (uint256(keccak256(abi.encodePacked(seed, "g2"))) % 128) +
            20; // 20-147
        uint256 b2 = (uint256(keccak256(abi.encodePacked(seed, "b2"))) % 128) +
            20; // 20-147

        // Random angle
        uint256 angle = uint256(keccak256(abi.encodePacked(seed, "angle"))) %
            360;

        return
            string(
                abi.encodePacked(
                    '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(',
                    angle.toString(),
                    ')">',
                    '<stop offset="0%" style="stop-color:rgb(',
                    r1.toString(),
                    ",",
                    g1.toString(),
                    ",",
                    b1.toString(),
                    ');stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:rgb(',
                    r2.toString(),
                    ",",
                    g2.toString(),
                    ",",
                    b2.toString(),
                    ');stop-opacity:1" />',
                    "</linearGradient>"
                )
            );
    }

    /**
     * @dev Generate a radial gradient background
     */
    function _generateRadialGradient(
        bytes32 seed
    ) internal pure returns (string memory) {
        uint256 r1 = (uint256(keccak256(abi.encodePacked(seed, "r1"))) % 100) +
            30; // 30-129
        uint256 g1 = (uint256(keccak256(abi.encodePacked(seed, "g1"))) % 100) +
            30; // 30-129
        uint256 b1 = (uint256(keccak256(abi.encodePacked(seed, "b1"))) % 100) +
            30; // 30-129

        uint256 r2 = (uint256(keccak256(abi.encodePacked(seed, "r2"))) % 60) +
            10; // 10-69
        uint256 g2 = (uint256(keccak256(abi.encodePacked(seed, "g2"))) % 60) +
            10; // 10-69
        uint256 b2 = (uint256(keccak256(abi.encodePacked(seed, "b2"))) % 60) +
            10; // 10-69

        return
            string(
                abi.encodePacked(
                    '<radialGradient id="bg" cx="50%" cy="50%" r="70%">',
                    '<stop offset="0%" style="stop-color:rgb(',
                    r1.toString(),
                    ",",
                    g1.toString(),
                    ",",
                    b1.toString(),
                    ');stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:rgb(',
                    r2.toString(),
                    ",",
                    g2.toString(),
                    ",",
                    b2.toString(),
                    ');stop-opacity:1" />',
                    "</radialGradient>"
                )
            );
    }

    /**
     * @dev Generate a solid color background
     */
    function _generateSolidBackground(
        bytes32 seed
    ) internal pure returns (string memory) {
        uint256 r = (uint256(keccak256(abi.encodePacked(seed, "r"))) % 120) +
            20; // 20-139
        uint256 g = (uint256(keccak256(abi.encodePacked(seed, "g"))) % 120) +
            20; // 20-139
        uint256 b = (uint256(keccak256(abi.encodePacked(seed, "b"))) % 120) +
            20; // 20-139

        return
            string(
                abi.encodePacked(
                    '<linearGradient id="bg">',
                    '<stop offset="0%" style="stop-color:rgb(',
                    r.toString(),
                    ",",
                    g.toString(),
                    ",",
                    b.toString(),
                    ');stop-opacity:1" />',
                    "</linearGradient>"
                )
            );
    }

    /**
     * @dev Generate high contrast text color based on background
     */
    function _generateTextColor(
        address minter,
        uint256 blockNum
    ) internal pure returns (string memory) {
        bytes32 seed = keccak256(
            abi.encodePacked(minter, "textcolor", blockNum / 200)
        );
        uint256 rand = uint256(seed);

        // Generate bright, high-contrast colors
        uint256 colorType = rand % 8;

        if (colorType == 0) {
            return
                '<stop offset="0%" style="stop-color:#00ff9f;stop-opacity:1" /><stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />';
        } else if (colorType == 1) {
            return
                '<stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" /><stop offset="100%" style="stop-color:#ffd93d;stop-opacity:1" />';
        } else if (colorType == 2) {
            return
                '<stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" /><stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />';
        } else if (colorType == 3) {
            return
                '<stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" /><stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />';
        } else if (colorType == 4) {
            return
                '<stop offset="0%" style="stop-color:#96fbc4;stop-opacity:1" /><stop offset="100%" style="stop-color:#f9f047;stop-opacity:1" />';
        } else if (colorType == 5) {
            return
                '<stop offset="0%" style="stop-color:#ffecd2;stop-opacity:1" /><stop offset="100%" style="stop-color:#fcb69f;stop-opacity:1" />';
        } else if (colorType == 6) {
            return
                '<stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" /><stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />';
        } else {
            return
                '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" /><stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />';
        }
    }

    /**
     * @dev Generate SVG data for a token
     */
    function _generateSVG(
        uint256 tokenId
    ) internal view returns (string memory) {
        address minter = originalMinter[tokenId];
        string[20] memory portraitLines = ASCIIPortraitLib.getPortraitLines(
            minter,
            block.number
        );

        // Generate dynamic background and text color
        string memory background = _generateBackground(minter, block.number);
        string memory textColor = _generateTextColor(minter, block.number);

        // Get last 3 characters of minter address for display
        string memory minterStr = Strings.toHexString(
            uint256(uint160(minter)),
            20
        );
        string memory addressSuffix = string(
            abi.encodePacked(
                bytes(minterStr)[39], // 3rd from end
                bytes(minterStr)[40], // 2nd from end
                bytes(minterStr)[41] // last character
            )
        );

        // Build the SVG with proper line spacing to fill the canvas
        string memory svgLines = "";

        for (uint256 i = 0; i < 20; i++) {
            svgLines = string(
                abi.encodePacked(
                    svgLines,
                    '<tspan x="400" dy="35">',
                    portraitLines[i],
                    "</tspan>"
                )
            );
        }

        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">',
                    "<defs>",
                    background,
                    '<linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
                    textColor,
                    "</linearGradient>",
                    "</defs>",
                    '<rect width="800" height="800" fill="url(#bg)"/>',
                    '<text x="400" y="50" fill="url(#textGrad)" font-family="Courier New,Courier,monospace" font-size="28px" font-weight="bold" text-anchor="middle" style="white-space:pre;letter-spacing:2px;text-shadow:2px 2px 4px rgba(0,0,0,0.8);">',
                    svgLines,
                    "</text>",
                    '<text x="50" y="750" fill="url(#textGrad)" font-family="Courier New,Courier,monospace" font-size="24px" font-weight="bold" style="text-shadow:2px 2px 4px rgba(0,0,0,0.8);">',
                    addressSuffix,
                    "</text>",
                    "</svg>"
                )
            );
    }

    /**
     * @dev Returns the URI for a token
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        // Check if the token exists
        if (tokenId == 0 || tokenId > _currentTokenId) {
            revert("Token does not exist");
        }
        _requireOwned(tokenId);

        string memory svg = _generateSVG(tokenId);
        string memory encodedSvg = Base64.encode(bytes(svg));
        string memory metadata = _generateMetadata(tokenId, encodedSvg);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(bytes(metadata))
                )
            );
    }

    /**
     * @dev Withdraw contract balance to owner
     */
    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Returns an array of token IDs owned by `owner`.
     * @param owner address to query
     * @return uint256[] array of token IDs owned by `owner`
     */
    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokens = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }
}
