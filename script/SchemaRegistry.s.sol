// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SchemaRegistry} from "../src/SchemaRegistry.sol";

contract SchemaRegistryScript is Script {
    SchemaRegistry public schemaRegistry;
    address owner = 0x742447Bbfa579BbF97875466D0eFB9EE4972B13B; // TODO update owner

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        schemaRegistry = new SchemaRegistry(owner);
        vm.stopBroadcast();
    }
}
