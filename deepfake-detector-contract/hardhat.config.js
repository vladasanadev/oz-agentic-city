require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const AURORA_PRIVATE_KEY = process.env.AURORA_PRIVATE_KEY || "0x" + "1".repeat(64);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Aurora Testnet
    "aurora-testnet": {
      url: "https://testnet.aurora.dev",
      chainId: 1313161555,
      accounts: [AURORA_PRIVATE_KEY],
      gas: 10000000,
      gasPrice: 1000000000, // 1 gwei
    },
    // Aurora Mainnet
    "aurora-mainnet": {
      url: "https://mainnet.aurora.dev",
      chainId: 1313161554,
      accounts: [AURORA_PRIVATE_KEY],
      gas: 10000000,
      gasPrice: 1000000000, // 1 gwei
    },
    // Local development
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      aurora: process.env.AURORA_API_KEY || "empty",
      auroraTestnet: process.env.AURORA_API_KEY || "empty",
    },
    customChains: [
      {
        network: "aurora",
        chainId: 1313161554,
        urls: {
          apiURL: "https://api.aurorascan.dev/api",
          browserURL: "https://aurorascan.dev",
        },
      },
      {
        network: "auroraTestnet",
        chainId: 1313161555,
        urls: {
          apiURL: "https://api-testnet.aurorascan.dev/api",
          browserURL: "https://testnet.aurorascan.dev",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}; 