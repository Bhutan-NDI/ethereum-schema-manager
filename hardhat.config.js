/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-ethers')
require('@nomicfoundation/hardhat-verify')
require('@openzeppelin/hardhat-upgrades')

require('dotenv/config')

module.exports = {
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`],
    },
    //Use for mainnet deployment
    // polygon: {
    //   url: process.env.MAINNET_RPCURL,
    //   accounts: [`0x${process.env.SIGNER_MAINNET}`],
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    enabled: true
  },
  sourcify: {
    enabled: true
  }
}