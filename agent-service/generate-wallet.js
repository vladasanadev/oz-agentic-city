const { ethers } = require('ethers');

console.log("🔑 Aurora Agent Wallet Generator");
console.log("===============================\n");

// Generate a new random wallet
const wallet = ethers.Wallet.createRandom();

console.log("✅ New agent wallet generated!");
console.log("\n📋 Wallet Details:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);

console.log("\n⚠️ SECURITY WARNING:");
console.log("- This is for TESTNET use only!");
console.log("- Never share the private key");
console.log("- Don't use this for mainnet funds");

console.log("\n📋 Next Steps:");
console.log("1. Send 0.005 Aurora testnet ETH to:", wallet.address);
console.log("2. Use this command to start agent:");
console.log(`   node autonomous-agent.js YOUR_CONTRACT_ADDRESS ${wallet.privateKey}`);
console.log("3. Authorize this address in your deployed contract");

console.log("\n🔗 Get Aurora testnet ETH:");
console.log("https://aurora.dev/faucet"); 