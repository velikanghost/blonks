// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../contracts/Blonks.sol";

contract Deploy is Script {
    struct NetworkConfig {
        string networkName;
        address deployer;
    }

    function setUp() public {}

    function getDeploymentConfig()
        internal
        view
        returns (NetworkConfig memory config)
    {
        address deployer = tx.origin;

        config = NetworkConfig({
            networkName: "Monad Testnet",
            deployer: deployer
        });
    }

    function run() external {
        NetworkConfig memory config = getDeploymentConfig();

        console2.log("=== Blonks NFT Deployment ===");
        console2.log("Network:", config.networkName);

        vm.startBroadcast();

        Blonks blonks = new Blonks();

        vm.stopBroadcast();

        logDeployment(address(blonks), config);
    }

    function logDeployment(
        address blonks,
        NetworkConfig memory config
    ) internal pure {
        console2.log("\n=== Deployment Summary ===");
        console2.log("Network:", config.networkName);
        console2.log("Blonks Contract:", blonks);
    }
}
