// Simple config for compilation only

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Aurora Testnet
    aurora_testnet: {
      url: "https://testnet.aurora.dev",
      chainId: 1313161555,
      accounts: [
        // Add your private key here (for testnet only!)
        // "0xYOUR_PRIVATE_KEY_HERE"
      ]
    },
    // Aurora Mainnet (for future)
    aurora: {
      url: "https://mainnet.aurora.dev",
      chainId: 1313161554,
      accounts: []
    },
    // Local development
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 