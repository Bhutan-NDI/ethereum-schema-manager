// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

import {Ownable} from "openzeppelin/access/Ownable.sol";

/**
 * @title SchemaRegistry
 * @dev Smart Contract for Schema Methods
 */
contract SchemaRegistry is Ownable {
    mapping(address _id => mapping(string schemaId => string schema)) public schemas;

    event SchemaCreate(address indexed id, string schemaId);

    constructor(address _owner) Ownable(_owner) {}

    /*
     * @dev Creates a new schema.
     * @param newSchemaId Identifier for the new schema.
     * @param _json JSON representation of the schema.
     */
    function createSchema(
        string calldata newSchemaId,
        string calldata _json
    ) external {
        require(bytes(schemas[msg.sender][newSchemaId]).length == 0, "SCHEMA_EXISTS");
        schemas[msg.sender][newSchemaId] = _json;
        emit SchemaCreate(msg.sender, newSchemaId);
    }

    /*
     * @dev Admin function to create a schema for any address.
     * @param target The address to create the schema for.
     * @param newSchemaId Identifier for the new schema.
     * @param _json JSON representation of the schema.
     */
    function adminCreateSchema(
        address _id,
        string calldata newSchemaId,
        string calldata _json
    ) external onlyOwner {
        require(bytes(schemas[_id][newSchemaId]).length == 0, "SCHEMA_EXISTS");
        schemas[_id][newSchemaId] = _json;
    }
}