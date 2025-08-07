## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

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
