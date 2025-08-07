## ethereum-schema-manager

The repository contains the schema smart contract and the functions for using Ethereum Blockchain.

## Development

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
