// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ASCIIPortraitLib
 * @dev Library for generating ASCII portraits with structured face patterns
 */
library ASCIIPortraitLib {
    // ASCII shading characters from lightest to darkest
    string constant SHADE_CHARS =
        " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    struct Portrait {
        string[20] lines; // 20 lines for better resolution
    }

    /**
     * @dev Get a deterministic random number from a seed
     */
    function _random(
        bytes32 seed,
        uint256 nonce
    ) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(seed, nonce)));
    }

    /**
     * @dev Get a character based on intensity (0-255)
     */
    function _getShade(
        uint256 intensity
    ) internal pure returns (string memory) {
        // Use a simpler set of characters for better readability
        uint256 idx = intensity / 32; // 256/32 = 8 levels (0-7)
        if (idx > 7) idx = 7;

        if (idx == 0) return " ";
        if (idx == 1) return ".";
        if (idx == 2) return "'";
        if (idx == 3) return ":";
        if (idx == 4) return "o";
        if (idx == 5) return "O";
        if (idx == 6) return "#";
        return "@";
    }

    /**
     * @dev Generate base portrait features from an address
     */
    function _generateBaseFeatures(
        address subject
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(subject, "portrait"));
    }

    /**
     * @dev Generate temporal variations based on block number
     */
    function _getTemporalVariation(
        uint256 blockNum
    ) internal pure returns (uint256) {
        return (blockNum / 100) % 16; // 16 different variations (was 8)
    }

    /**
     * @dev Get face template intensity for a given position
     */
    function _getFaceIntensity(
        uint256 x,
        uint256 y,
        bytes32 seed,
        uint256 variation
    ) internal pure returns (uint256) {
        // Create a basic face structure
        uint256 centerX = 12;
        uint256 centerY = 10;

        // Calculate distance from center
        uint256 distX = x > centerX ? x - centerX : centerX - x;
        uint256 distY = y > centerY ? y - centerY : centerY - y;

        // Face outline (oval)
        uint256 faceIntensity = 0;
        if (distX <= 8 && distY <= 8) {
            uint256 ovalDist = (distX * distX * 64) + (distY * distY * 100);
            if (ovalDist <= 4096) {
                // Inside face
                faceIntensity = 80;
            }
        }

        // Eyes
        if (y >= 6 && y <= 8) {
            if ((x >= 8 && x <= 10) || (x >= 14 && x <= 16)) {
                faceIntensity = 200 + (variation * 10);
            }
        }

        // Nose
        if (y >= 10 && y <= 12 && x >= 11 && x <= 13) {
            faceIntensity = 120 + (variation * 8);
        }

        // Mouth
        if (y >= 14 && y <= 15 && x >= 10 && x <= 14) {
            faceIntensity = 150 + (variation * 12);
        }

        // Hair/forehead
        if (y <= 4 && distX <= 8) {
            faceIntensity = 60 + (variation * 15);
        }

        // Add some randomness for texture
        uint256 noise = _random(seed, x * 25 + y * 25 + variation);
        faceIntensity += (noise % 40);

        return faceIntensity > 255 ? 255 : faceIntensity;
    }

    /**
     * @dev Generate a single line of the portrait
     */
    function _generateLine(
        bytes32 seed,
        uint256 lineNum,
        uint256 variation
    ) internal pure returns (string memory) {
        string memory line = "";

        for (uint256 i = 0; i < 24; i++) {
            uint256 intensity = _getFaceIntensity(i, lineNum, seed, variation);
            line = string(abi.encodePacked(line, _getShade(intensity)));
        }

        return line;
    }

    /**
     * @dev Generate the complete ASCII portrait
     */
    function generatePortrait(
        address subject,
        uint256 blockNum
    ) internal pure returns (string memory) {
        bytes32 baseFeatures = _generateBaseFeatures(subject);
        uint256 variation = _getTemporalVariation(blockNum);

        Portrait memory portrait;

        // Generate all lines
        for (uint256 i = 0; i < 20; i++) {
            portrait.lines[i] = _generateLine(baseFeatures, i, variation);
        }

        // Return the portrait as a structured format for SVG rendering
        return _assemblePortrait(portrait);
    }

    /**
     * @dev Assemble portrait lines into a format suitable for SVG
     */
    function _assemblePortrait(
        Portrait memory portrait
    ) internal pure returns (string memory) {
        string memory result = "";

        for (uint256 i = 0; i < 20; i++) {
            result = string(abi.encodePacked(result, portrait.lines[i]));
            if (i < 19) {
                result = string(abi.encodePacked(result, "|")); // Use | as line separator
            }
        }

        return result;
    }

    /**
     * @dev Split portrait into lines for SVG rendering
     */
    function getPortraitLines(
        address subject,
        uint256 blockNum
    ) internal pure returns (string[20] memory) {
        bytes32 baseFeatures = _generateBaseFeatures(subject);
        uint256 variation = _getTemporalVariation(blockNum);

        string[20] memory lines;

        for (uint256 i = 0; i < 20; i++) {
            lines[i] = _generateLine(baseFeatures, i, variation);
        }

        return lines;
    }
}
