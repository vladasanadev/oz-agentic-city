const { ethers } = require("ethers");
const crypto = require("crypto");

async function convertNearKeyToAurora() {
  console.log("🔄 Converting NEAR key to Aurora format...");
  
  // Your NEAR private key (ed25519 format)
  const nearPrivateKey = "2GNNDLMu3hiyGtw97TzHzPgYgFAqYub1xVhYMX4pkVptL9j5DkWbax1FaD14ksoiGj3nRqv7AM3kz8Ps4j3VhJu6";
  
  // For Aurora, we need to generate a new secp256k1 key
  // We'll use your NEAR key as a seed for deterministic generation
  const seed = crypto.createHash('sha256').update(nearPrivateKey).digest();
  
  // Create Aurora-compatible wallet
  const auroraWallet = new ethers.Wallet(seed);
  
  console.log("✅ Conversion complete!");
  console.log("\n📋 Your Aurora Account Details:");
  console.log("Address:", auroraWallet.address);
  console.log("Private Key:", auroraWallet.privateKey);
  console.log("Private Key (without 0x):", auroraWallet.privateKey.slice(2));
  
  console.log("\n🔧 Next Steps:");
  console.log("1. Update your .env file with the private key (without 0x)");
  console.log("2. Get Aurora testnet ETH from the faucet");
  console.log("3. Deploy your contract");
  
  console.log("\n💰 Get Aurora Testnet ETH:");
  console.log("Visit: https://aurora.dev/faucet");
  console.log("Enter your address:", auroraWallet.address);
  
  return {
    address: auroraWallet.address,
    privateKey: auroraWallet.privateKey.slice(2) // Remove 0x prefix
  };
}

convertNearKeyToAurora().catch(console.error); 