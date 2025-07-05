// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/Portraits.sol";

contract Deploy is Script {
    struct NetworkConfig {
        string networkName;
        address deployer;
    }

    function setUp() public {}

    function getDeploymentConfig() internal view returns (NetworkConfig memory config) {
        uint256 chainId = block.chainid;
        address deployer = msg.sender;

        config = NetworkConfig({networkName: "Monad Testnet", deployer: deployer});
    }

    function run() external {
        NetworkConfig memory config = getDeploymentConfig();

        console2.log("=== Portraits NFT Deployment ===");
        console2.log("Network:", config.networkName);
        console2.log("Deployer:", config.deployer);

        vm.startBroadcast();
        
        Portraits portraits = new Portraits();
        
        vm.stopBroadcast();

        logDeployment(address(portraits), config);
    }

    function logDeployment(address portraits, NetworkConfig memory config) internal pure {
        console2.log("\n=== Deployment Summary ===");
        console2.log("Network:", config.networkName);
        console2.log("Deployer:", config.deployer);
        console2.log("Portraits Contract:", portraits);
    }
}