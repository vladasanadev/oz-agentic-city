const { ethers } = require("ethers");

async function generateAuroraWallet() {
  console.log("🎯 Generating new Aurora wallet for testing...");
  
  // Generate a random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log("✅ Aurora wallet generated!");
  console.log("\n📋 Your Aurora Testnet Account:");
  console.log("Address:", wallet.address);
  console.log("Private Key:", wallet.privateKey);
  console.log("Private Key (for .env):", wallet.privateKey.slice(2));
  console.log("Mnemonic:", wallet.mnemonic.phrase);
  
  console.log("\n🔧 Setup Instructions:");
  console.log("1. Copy the private key (without 0x) to your .env file");
  console.log("2. Get Aurora testnet ETH from the faucet");
  console.log("3. Deploy your contract");
  
  console.log("\n💰 Get Aurora Testnet ETH:");
  console.log("1. Visit: https://aurora.dev/faucet");
  console.log("2. Enter your address:", wallet.address);
  console.log("3. Request testnet ETH");
  
  console.log("\n🔒 IMPORTANT - Save These Credentials:");
  console.log("- Address:", wallet.address);
  console.log("- Private Key:", wallet.privateKey);
  console.log("- Mnemonic:", wallet.mnemonic.phrase);
  
  return wallet;
}

generateAuroraWallet().catch(console.error); 