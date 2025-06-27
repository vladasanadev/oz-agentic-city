const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DeepfakeDetector to Aurora...");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  // Deploy contract
  const DeepfakeDetector = await hre.ethers.getContractFactory("DeepfakeDetector");
  console.log("Deploying contract...");
  
  const detector = await DeepfakeDetector.deploy();
  await detector.deployed();
  
  console.log("✅ DeepfakeDetector deployed to:", detector.address);
  console.log("🔗 Aurora Explorer:", `https://testnet.aurorascan.dev/address/${detector.address}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: detector.address,
    deployer: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
    explorerUrl: `https://testnet.aurorascan.dev/address/${detector.address}`
  };
  
  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Test basic functionality
  console.log("\n🧪 Testing contract...");
  const totalScans = await detector.getTotalScans();
  console.log("Initial total scans:", totalScans.toString());
  
  console.log("\n🎉 Deployment complete!");
  console.log("Contract address:", detector.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 