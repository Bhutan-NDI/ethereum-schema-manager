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

### Help

```shell
forge --help
```
