// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/Portraits.sol";

contract DeployPortraits is Script {
    function run() external {
        vm.startBroadcast();
        
        Portraits portraits = new Portraits();
        console.log("Portraits deployed to:", address(portraits));
        
        vm.stopBroadcast();
    }
} 