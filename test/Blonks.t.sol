// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../contracts/Blonks.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlonksTest is Test {
    Blonks public blonks;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        vm.startPrank(owner);
        blonks = new Blonks();
        vm.stopPrank();
    }

    function test_InitialState() public view {
        assertEq(blonks.name(), "Blonks");
        assertEq(blonks.symbol(), "BLONK");
        assertEq(blonks.owner(), owner);
    }

    function test_Mint() public {
        vm.deal(user1, 1 ether);

        vm.startPrank(user1);
        blonks.mint{value: 0.1 ether}();
        vm.stopPrank();

        assertEq(blonks.balanceOf(user1), 1);
        assertEq(blonks.ownerOf(1), user1);
        assertEq(blonks.originalMinter(1), user1);
    }

    function test_RevertWhen_MintUnderpriced() public {
        vm.deal(user1, 1 ether);

        vm.startPrank(user1);
        vm.expectRevert("Insufficient payment");
        blonks.mint{value: 0.009 ether}();
        vm.stopPrank();
    }

    function test_TokenURIContent() public {
        vm.deal(user1, 1 ether);

        vm.startPrank(user1);
        blonks.mint{value: 0.1 ether}();
        vm.stopPrank();

        string memory uri = blonks.tokenURI(1);

        // Skip "data:application/json;base64," prefix (29 chars)
        string memory base64Json = substring(uri, 29, bytes(uri).length - 29);

        // Use FFI to decode base64
        string[] memory inputs = new string[](2);
        inputs[0] = "test/decode_base64.sh";
        inputs[1] = base64Json;
        bytes memory decodedBytes = vm.ffi(inputs);
        string memory decoded = string(decodedBytes);

        emit log_string("Decoded JSON:");
        emit log_string(decoded);

        // Check for required fields
        assertTrue(
            _contains(decoded, "name") &&
                _contains(decoded, "description") &&
                _contains(decoded, "image") &&
                _contains(decoded, "attributes"),
            "TokenURI missing required fields"
        );
    }

    function test_PortraitEvolution() public {
        vm.deal(user1, 1 ether);

        vm.startPrank(user1);
        blonks.mint{value: 0.1 ether}();
        vm.stopPrank();

        // Get initial URI
        string memory uri1 = blonks.tokenURI(1);

        // Move forward 100 blocks
        vm.roll(block.number + 100);

        // Get new URI
        string memory uri2 = blonks.tokenURI(1);

        // URIs should be different due to temporal variation
        assertTrue(
            keccak256(bytes(uri1)) != keccak256(bytes(uri2)),
            "Portrait should evolve over time"
        );
    }

    function test_ConsistentPortraits() public {
        vm.deal(user1, 1 ether);

        vm.startPrank(user1);
        blonks.mint{value: 0.1 ether}();
        vm.stopPrank();

        // Get URI at current block
        string memory uri1 = blonks.tokenURI(1);

        // Get URI again at same block
        string memory uri2 = blonks.tokenURI(1);

        // URIs should be identical for same block
        assertEq(
            keccak256(bytes(uri1)),
            keccak256(bytes(uri2)),
            "Portrait should be deterministic"
        );
    }

    function test_Withdraw() public {
        // Fund contract
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        blonks.mint{value: 0.1 ether}();

        // Check initial balance
        uint256 initialBalance = owner.balance;

        // Withdraw
        vm.prank(owner);
        blonks.withdraw();

        // Verify withdrawal
        assertEq(address(blonks).balance, 0);
        assertEq(owner.balance, initialBalance + 0.1 ether);
    }

    function test_RevertWhen_WithdrawNotOwner() public {
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                Ownable.OwnableUnauthorizedAccount.selector,
                user1
            )
        );
        blonks.withdraw();
    }

    // Helper function to extract substring
    function substring(
        string memory str,
        uint256 startIndex,
        uint256 length
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(length);
        for (uint i = 0; i < length; i++) {
            result[i] = strBytes[startIndex + i];
        }
        return string(result);
    }

    // Helper function to check if a string contains a substring
    function _contains(
        string memory str,
        string memory substr
    ) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory substrBytes = bytes(substr);

        if (strBytes.length < substrBytes.length) {
            return false;
        }

        for (uint i = 0; i <= strBytes.length - substrBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < substrBytes.length; j++) {
                if (strBytes[i + j] != substrBytes[j]) {
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
