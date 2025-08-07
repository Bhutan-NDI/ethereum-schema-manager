// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {SchemaRegistry} from "../src/SchemaRegistry.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SchemaRegistryTest is Test {
    SchemaRegistry public schemaRegistry;

    event SchemaCreate(address indexed id, string schemaId);
    event AdminSchemaCreate(address indexed admin, address indexed target, string schemaId);

    address public owner;
    address public alice;
    address public bob;

    function setUp() public {
        owner = makeAddr("owner");
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        schemaRegistry = new SchemaRegistry(owner);
    }

    function test_CreateSchema() public {
        string memory schemaId = "user-profile";
        string memory schemaJson = '{"type":"object","properties":{"name":{"type":"string"},"age":{"type":"number"}}}';

        // Create same schemaId as different user
        address user = makeAddr("user");
        vm.startPrank(user);
        schemaRegistry.createSchema(schemaId, schemaJson);

        string memory retrievedSchema = schemaRegistry.schemas(user, schemaId);
        assertEq(retrievedSchema, schemaJson);

        vm.expectRevert("SCHEMA_EXISTS");
        schemaRegistry.createSchema(schemaId, schemaJson);
        vm.stopPrank();
    }

    function test_MultipleSchemasByDifferentUsers() public {
        string memory schemaId = "shared-schema-id";
        string memory schemaJson1 = '{"version":1}';
        string memory schemaJson2 = '{"version":2}';

        // Create schema as current user
        address user1 = makeAddr("user1");
        vm.prank(user1);
        schemaRegistry.createSchema(schemaId, schemaJson1);

        // Create same schemaId as different user
        address user2 = makeAddr("user2");
        vm.prank(user2);
        schemaRegistry.createSchema(schemaId, schemaJson2);

        // Verify both schemas exist independently
        assertEq(schemaRegistry.schemas(user1, schemaId), schemaJson1);
        assertEq(schemaRegistry.schemas(user2, schemaId), schemaJson2);
    }

    function test_EmptySchemaId() public {
        string memory emptySchemaId = "";
        string memory schemaJson = '{"type":"object"}';

        address user = makeAddr("user");
        vm.prank(user);
        schemaRegistry.createSchema(emptySchemaId, schemaJson);

        string memory retrievedSchema = schemaRegistry.schemas(user, emptySchemaId);
        assertEq(retrievedSchema, schemaJson);
    }

    function test_AdminCreateSchema() public {
        string memory schemaId = "admin-created-schema";
        string memory schemaJson = '{"type":"object","admin":true}';

        // Test admin can create schema for alice
        vm.prank(owner);
        schemaRegistry.adminCreateSchema(alice, schemaId, schemaJson);

        // Verify the schema was created for alice
        string memory retrievedSchema = schemaRegistry.schemas(alice, schemaId);
        assertEq(retrievedSchema, schemaJson);
    }

    function test_AdminCannotCreateDuplicateSchema() public {
        string memory schemaId = "duplicate-test";
        string memory schemaJson = '{"version":1}';

        // Alice creates a schema
        vm.prank(alice);
        schemaRegistry.createSchema(schemaId, schemaJson);

        // Admin tries to create the same schema for alice
        vm.startPrank(owner);
        vm.expectRevert("SCHEMA_EXISTS");
        schemaRegistry.adminCreateSchema(alice, schemaId, schemaJson);
        vm.stopPrank();
    }

    function test_OnlyOwnerCanCallAdminCreateSchema() public {
        string memory schemaId = "unauthorized-schema";
        string memory schemaJson = '{"type":"object"}';

        // Non-owner tries to call adminCreateSchema
        vm.startPrank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        schemaRegistry.adminCreateSchema(bob, schemaId, schemaJson);
        vm.stopPrank();
    }

    function test_OwnerIsSetCorrectly() public {
        assertEq(schemaRegistry.owner(), owner);

        // Test that transferring to address(0) reverts
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableInvalidOwner.selector, address(0)));
        schemaRegistry.transferOwnership(address(0));

        // Transfer to a valid address
        vm.prank(owner);
        schemaRegistry.transferOwnership(alice);
        assertEq(schemaRegistry.owner(), alice);

        // Test ownership renouncement
        vm.prank(alice);
        schemaRegistry.renounceOwnership();
        assertEq(schemaRegistry.owner(), address(0));
    }
}