# ethereum-schema-manager
The repository contains the schema smart contract and the functions for using Ethereum Blockchain.

### To use this repo for schema contract deployment,
#### run:

- `npx hardhat compile`

- `npx hardhat run scripts/deploy.js --network sepolia`

### To verify the contract post deployment,
#### run:
- `npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS> "CONSTRUCTOR_ARGUMENT"`

- To get the "`CONSTRUCTOR_ARGUMENT`", check the `deploy.js` and see the constructor which takes the parameter.
- In the current code, check `line 24`, there's 
```
const schemaRegistry = await SchemaRegistry.deploy(owner.address)
```
- meaning, the constructor takes the deployer's address as the owner parameter

#### Get the deployer address:
- `npx hardhat console --network sepolia`:
```
const [deployer] = await ethers.getSigners();
console.log(deployer.address);
```
#### then,
- `npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS> "CONSTRUCTOR_ARGUMENT"`