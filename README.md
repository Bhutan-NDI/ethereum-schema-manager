# ethereum-schema-manager

A TypeScript client for interacting with SchemaRegistry smart contract on Ethereum networks.

## Features

- **Create Schema**: Create a new JSON-LD credential schema. This method allows users to define the structure and properties of the credential schema.

- **Get Schema by ID**: Retrieves schema details by its unique ID.

- **Admin Create Schema**: Admin or contract owner can create a new JSON-LD credential schema for other address. This method allows definining the structure and properties of the credential schema.

- **Transfer Ownership**: Admin or contract owner can change the owner to different address. This method allows the transfer of ownership to another address.

## 🛠️ Installation

```bash
npm install @bhutan-ndi/ethereum-schema-manager ethers
```

## Quick Start

### Read-Only Operations

```typescript
import { EthereumSchemaManager } from '@bhutan-ndi/ethereum-schema-manager'

const client = new EthereumSchemaManager({
  contractAddress: '0x1234567890123456789012345678901234567890',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID',
})

// Get schema
const schema = await client.getSchema(ownerAddress, 'my-schema-id')
console.log(schema?.json)

// Get contract owner
const owner = await client.getOwner()
```

### Transactional Operations

```typescript
import { EthereumSchemaManager } from '@bhutan-ndi/ethereum-schema-manager'

const client = new EthereumSchemaManager({
  contractAddress: '0x1234567890123456789012345678901234567890',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID',
  privateKey: '0xYOUR-PRIVATE-KEY',
})

// Create a schema
try {
  const receipt = await client.createSchema('my-schema', schemaObject)

  console.log(`Schema created! Transaction: ${receipt.hash}`)
  console.log(`Gas used: ${receipt.gasUsed}`)
  console.log(`Status: ${receipt.status}`)
} catch (error) {
  if (error instanceof ContractError) {
    console.error('Contract error:', error.revertReason)
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message)
  }
}
```

## Configuration

```typescript
interface SchemaManagerConfig {
  contractAddress: string // Smart contract address
  rpcUrl: string // Ethereum RPC endpoint
  privateKey?: string // Private key for transactions (optional)
}
```

## API Reference

### SchemaManager

#### Constructor

- `constructor(config: SchemaManagerConfig)`

#### Read Methods

- `getOwner(): Promise<string>` - Get contract owner address
- `getSchema(address: string, schemaId: string): Promise<object | null>` - Get schema by owner and ID

#### Transaction Methods (require private key)

- `createSchema(schemaId: string, json: string): Promise<ContractTransactionReceipt>` - Create new schema
- `adminCreateSchema(address: string, schemaId: string, json: string): Promise<ContractTransactionReceipt>` - Admin create schema for another address
- `transferOwnership(newOwner: string): Promise<ContractTransactionReceipt>` - Transfer contract ownership

## Error Handling

Specific error types for different scenarios:

```typescript
import {
  SchemaRegistryError,
  ContractError,
  NetworkError,
  ValidationError,
} from '@bhutan-ndi/ethereum-schema-manager'

try {
  await client.createSchema('invalid', 'invalid-json')
} catch (error) {
  if (error instanceof ValidationError) {
    // Input validation failed
    console.error('Invalid input:', error.message)
  } else if (error instanceof ContractError) {
    // Smart contract rejected transaction
    console.error('Contract error:', error.revertReason)
  } else if (error instanceof NetworkError) {
    // Network/RPC issues
    console.error('Network error:', error.message)
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm run test

## Run tests with GUI
pnpm run test:ui
```

## Smart Contract Development

Foundry docs: https://book.getfoundry.sh/

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Gas Snapshots

```shell
forge snapshot
```

### Deploy

Create a `.env` file with your private key:

```
PRIVATE_KEY=your_private_key_here
```

First run a simulation without broadcasting:

```shell
forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url <your_rpc_url>
```

If the simulation is successful, run with `--broadcast` to deploy:

```shell
forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url <your_rpc_url> --broadcast
```


### TODO after cloning this repo:
#### 1. Install Foundry if you do not have
- `curl -L https://foundry.paradigm.xyz | bash`

- `foundryup`

#### 2. Setup the repository
- `forge install`

#### 3. Create .env
```
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

#### 4.Update the Deployment Script 
- Set owner contract address inside `SchemaRegistry.s.sol`:
- Run `cast wallet address --private-key $PRIVATE_KEY` to get the owner address
- then,
```
// ...existing code...

    SchemaRegistry public schemaRegistry;
    address owner = 0xYourOwnerAddressHere; // UPDATE THIS with an owner address
```

#### 5. Dry run
- Ensure you add `0x` to the `PRIVATE_KEY` in the `.env` file
- `source .env`
- `forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url $SEPOLIA_RPC_URL`


#### 6. Deploy
- `forge script script/SchemaRegistry.s.sol:SchemaRegistryScript --rpc-url $SEPOLIA_RPC_URL --broadcast`

#### 7. Verify contract
- Place `ETHERSCAN_API_KEY=your_etherscan_api_key` in the `.env` file
- Then;
```
forge verify-contract <DEPLOYED_CONTRACT_ADDRESS> SchemaRegistry \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --chain sepolia \
    --constructor-args $(cast abi-encode "constructor(address)" <OWNER_ADDRESS>)
```
##### 7.1 To get owner adress, run:

### Help

```shell
forge --help
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
