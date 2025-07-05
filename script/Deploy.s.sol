// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/Gatherers.sol";

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

        console.log("=== Gatherers NFT Deployment ===");
        console.log("Network:", config.networkName);
        console.log("Deployer:", config.deployer);

        vm.startBroadcast();
        
        Gatherers gatherers = new Gatherers(config.deployer);
        
        vm.stopBroadcast();

        logDeployment(address(gatherers), config);
    }

    function logDeployment(address gatherers, NetworkConfig memory config) internal pure {
        console.log("\n=== Deployment Summary ===");
        console.log("Network:", config.networkName);
        console.log("Deployer:", config.deployer);
        console.log("Gatherers Contract:", gatherers);
    }
}