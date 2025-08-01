// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.28;

/**
 * @title SchemaRegistry
 * @dev Smart Contract for Schema Methods
 */
contract SchemaRegistry {
    address public owner;
    mapping(address _id => mapping(string schemaId => string schema)) public schemas;

    event SchemaCreate(address indexed id, string schemaId);

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

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
        emit SchemaCreate(_id, newSchemaId);
    }
}