## Ethereum Schema Manager

A decentralized schema registry built on Ethereum that enables users to create, store, and manage JSON schemas on-chain. This smart contract system provides a secure and transparent way to register data schemas that can be referenced and validated across decentralized applications.

### Key Features

- **Schema Creation**: Users can create and register JSON schemas with unique identifiers
- **Decentralized Storage**: All schemas are stored permanently on the Ethereum blockchain
- **Address-based Organization**: Each Ethereum address can manage its own collection of schemas
- **Administrative Controls**: Contract owner can create schemas on behalf of other addresses
- **Event Logging**: Schema creation events are emitted for easy tracking and indexing

The repository contains the schema smart contract and the functions for using Ethereum Blockchain.

## Contract Deployments

| Network Name | Name | Chain ID | Hex Chain ID | Schema Address | Schema Version |
|--------------|------|----------|--------------|------------------|------------------|
| **Mainnet** | mainnet | 1 | 0x1 | [`0xc5e...5c73`](https://etherscan.io/address/0xC5E56Eccf9694eE6E1c7F3Db3998DCe08BCe5C73) | 16f206d5 |
| **Sepolia** | Sepolia | 11155111 | 0xaa36a7 | [`0xa95...5c15`](https://sepolia.etherscan.io/address/0xa95ACF3119791F65b2192267836df9A472785c15) | 16f206d5 |


### Primary Networks for Development
- **Sepolia Testnet**: Recommended for testing and development
- **Ethereum Mainnet**: Production deployments

## TODO after cloning this repo:
### 1. Install Foundry if you do not have
- `curl -L https://foundry.paradigm.xyz | bash`

- `foundryup`

### 2. Setup the repository
- `forge install`

### 3. Create .env
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

### 4. Update the Deployment Script 
- Set owner contract address inside `SchemaRegistry.s.sol`:
- Run `cast wallet address --private-key $PRIVATE_KEY` to get the owner address or directly copy from your crypto wallet.
- then,
```
// ...existing code...

    SchemaRegistry public schemaRegistry;
    address owner = 0xYourOwnerAddressHere; // UPDATE THIS with an owner address
```

### 5. Dry run
- Ensure you add `0x` to the `PRIVATE_KEY` in the `.env` file
- `source .env`
- `forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url $SEPOLIA_RPC_URL`


### 6. Deploy
- `forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url $SEPOLIA_RPC_URL --broadcast`

### 7. Verify contract
- Place `ETHERSCAN_API_KEY=your_etherscan_api_key` in the `.env` file
- Then;
```
forge verify-contract <DEPLOYED_CONTRACT_ADDRESS> SchemaRegistry \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --chain sepolia \
    --constructor-args $(cast abi-encode "constructor(address)" <OWNER_ADDRESS>)
```
### Help

```shell
forge --help
```
