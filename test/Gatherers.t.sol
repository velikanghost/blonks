// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/Gatherers.sol";

contract GatherersTest is Test {
    Gatherers public gatherers;
    address public treasury;
    address public alice;
    address public bob;

    function setUp() public {
        // Create test addresses
        treasury = makeAddr("treasury");
        alice = makeAddr("alice");
        bob = makeAddr("bob");

        // Deploy contract
        vm.prank(treasury);
        gatherers = new Gatherers(treasury);
    }

    function test_InitialState() public {
        assertEq(gatherers.name(), "Gatherers");
        assertEq(gatherers.symbol(), "GTHR");
        assertEq(gatherers.GRID_SIZE(), 10);
        assertEq(gatherers.MAX_SUPPLY(), 100);
        assertEq(gatherers.TREASURY_RESERVE(), 3);
    }

    function test_TreasuryReserve() public {
        // Check that treasury has exactly 3 tokens
        assertEq(gatherers.balanceOf(treasury), 3);
        
        // Verify the tokens are valid (within grid bounds)
        for (uint256 i = 0; i < gatherers.totalSupply(); i++) {
            uint256 tokenId = gatherers.tokenByIndex(i);
            (uint8 x, uint8 y) = gatherers._idToCoords(tokenId);
            assertTrue(x < gatherers.GRID_SIZE());
            assertTrue(y < gatherers.GRID_SIZE());
        }
    }

    function test_RandomMint() public {
        // Alice mints a token
        vm.prank(alice);
        gatherers.mint();
        
        // Check Alice owns exactly one token
        assertEq(gatherers.balanceOf(alice), 1);
        
        // Get Alice's token
        uint256 tokenId = gatherers.tokenOfOwnerByIndex(alice, 0);
        
        // Verify token coordinates are valid
        (uint8 x, uint8 y) = gatherers._idToCoords(tokenId);
        assertTrue(x < gatherers.GRID_SIZE());
        assertTrue(y < gatherers.GRID_SIZE());
    }

    function test_MultipleMints() public {
        // Multiple users mint tokens
        vm.prank(alice);
        gatherers.mint();
        
        vm.prank(bob);
        gatherers.mint();
        
        // Check balances
        assertEq(gatherers.balanceOf(alice), 1);
        assertEq(gatherers.balanceOf(bob), 1);
        
        // Get tokens
        uint256 aliceToken = gatherers.tokenOfOwnerByIndex(alice, 0);
        uint256 bobToken = gatherers.tokenOfOwnerByIndex(bob, 0);
        
        // Verify tokens are different
        assertTrue(aliceToken != bobToken);
    }

    function test_MintAllPositions() public {
        // Mint all remaining positions (100 - 3 treasury tokens = 97)
        for (uint256 i = 0; i < 97; i++) {
            vm.prank(alice);
            gatherers.mint();
        }
        
        // Verify total supply
        assertEq(gatherers.totalSupply(), 100);
        
        // Try to mint one more (should fail)
        vm.prank(bob);
        vm.expectRevert(bytes("NO_POSITIONS"));
        gatherers.mint();
    }

    function test_TokenURIMetadata() public {
        // Mint a token
        vm.prank(alice);
        gatherers.mint();
        
        // Get Alice's token
        uint256 tokenId = gatherers.tokenOfOwnerByIndex(alice, 0);
        
        // Get token URI
        string memory uri = gatherers.tokenURI(tokenId);
        
        // Verify it's a valid base64 data URI
        assertStartsWith(uri, "data:application/json;base64,");

        // Decode base64 JSON data
        string memory jsonStr = _parseDataURI(uri);
        
        // Extract and validate fields
        string memory name = abi.decode(vm.parseJson(jsonStr, ".name"), (string));
        string memory description = abi.decode(vm.parseJson(jsonStr, ".description"), (string));
        string memory image = abi.decode(vm.parseJson(jsonStr, ".image"), (string));
        
        // Get coordinates for validation
        (uint8 x, uint8 y) = gatherers._idToCoords(tokenId);
        
        // Validate metadata fields
        assertEq(name, string.concat("Gatherers Tile (", vm.toString(x), ",", vm.toString(y), ")"));
        assertEq(description, "ASCII map tile from Gatherers.");
        
        // Verify image is a valid SVG data URI
        assertStartsWith(image, "data:image/svg+xml;base64,");
        
        // Decode and validate SVG
        string memory svg = _parseDataURI(image);
        assertStartsWith(svg, "<svg xmlns=\"http://www.w3.org/2000/svg\"");
        assertTrue(bytes(svg).length > 0);
    }

    // Helper function to check string prefix
    function assertStartsWith(string memory str, string memory prefix) internal pure {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);
        
        require(strBytes.length >= prefixBytes.length, "String shorter than prefix");
        
        for (uint i = 0; i < prefixBytes.length; i++) {
            assertEq(strBytes[i], prefixBytes[i]);
        }
    }

    // Helper to decode base64 data URI
    function _parseDataURI(string memory uri) internal returns (string memory) {
        bytes memory uriBytes = bytes(uri);
        uint256 commaIndex;
        
        // Find the comma after base64,
        for (uint i = 0; i < uriBytes.length; i++) {
            if (uriBytes[i] == ",") {
                commaIndex = i;
                break;
            }
        }
        
        // Extract and decode the base64 data
        bytes memory encodedData = new bytes(uriBytes.length - commaIndex - 1);
        for (uint i = 0; i < encodedData.length; i++) {
            encodedData[i] = uriBytes[i + commaIndex + 1];
        }
        
        // Use decode_base64.sh script
        string[] memory inputs = new string[](2);
        inputs[0] = "test/decode_base64.sh";
        inputs[1] = string(encodedData);
        return string(vm.ffi(inputs));
    }

    // Helper to check if string contains substring
    function _containsString(string memory str, string memory searchStr) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory searchBytes = bytes(searchStr);

        if (searchBytes.length > strBytes.length) {
            return false;
        }

        for (uint i = 0; i <= strBytes.length - searchBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < searchBytes.length; j++) {
                if (strBytes[i + j] != searchBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }
        return false;
    }
} 