const { ethers } = require('ethers');

console.log("🔑 Aurora TESTNET Agent Wallet Generator");
console.log("======================================");
console.log("🧪 HACKATHON/DEMO ONLY - NO REAL MONEY!");
console.log("=======================================\n");

// Generate a new random wallet
const wallet = ethers.Wallet.createRandom();

console.log("✅ New TESTNET agent wallet generated!");
console.log("\n📋 Wallet Details (TESTNET ONLY):");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);

console.log("\n🧪 TESTNET SAFETY:");
console.log("✅ This is Aurora TESTNET only");
console.log("✅ No real ETH or tokens involved");
console.log("✅ Perfect for hackathon demos");
console.log("✅ Free test tokens from faucet");

console.log("\n📋 Next Steps (TESTNET):");
console.log("1. Get FREE Aurora testnet ETH from faucet for:", wallet.address);
console.log("   🔗 https://aurora.dev/faucet");
console.log("2. Use this command to start agent:");
console.log(`   node autonomous-agent.js YOUR_CONTRACT_ADDRESS ${wallet.privateKey}`);
console.log("3. Authorize this address in your deployed contract");

console.log("\n🎯 For Hackathon Demo:");
console.log("- Aurora Testnet = Fast & Free");
console.log("- No real money needed");
console.log("- Perfect for showcasing autonomous agents");
console.log("- All transactions visible on Aurora testnet explorer");

console.log("\n🚀 Ready for NEAR hackathon presentation!"); 