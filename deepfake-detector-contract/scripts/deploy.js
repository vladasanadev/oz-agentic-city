const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of DeepfakeDetector contract...");
  
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy the contract
  console.log("🔨 Deploying DeepfakeDetector...");
  const DeepfakeDetector = await hre.ethers.getContractFactory("DeepfakeDetector");
  const deepfakeDetector = await DeepfakeDetector.deploy();
  
  await deepfakeDetector.waitForDeployment();
  const contractAddress = await deepfakeDetector.getAddress();
  
  console.log("✅ DeepfakeDetector deployed to:", contractAddress);
  
  // Get deployment transaction details
  const deploymentTx = deepfakeDetector.deploymentTransaction();
  console.log("📋 Deployment transaction hash:", deploymentTx.hash);
  
  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await deploymentTx.wait(3);
  
  console.log("🎉 Contract deployed successfully!");
  console.log("\n📊 Contract Details:");
  console.log("- Contract Address:", contractAddress);
  console.log("- Network:", hre.network.name);
  console.log("- Deployer:", deployer.address);
  
  // Verify contract on Aurora Explorer (if not local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 Verifying contract on Aurora Explorer...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
      console.log("💡 You can manually verify later using:");
      console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
    }
  }
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    deploymentHash: deploymentTx.hash,
    timestamp: new Date().toISOString(),
    blockNumber: deploymentTx.blockNumber,
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    `deployment-${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`\n💾 Deployment info saved to deployment-${hre.network.name}.json`);
  
  // Display usage instructions
  console.log("\n🔧 Usage Instructions:");
  console.log("1. Add this contract address to your frontend:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Authorize your detection agent:");
  console.log(`   await contract.setDetectorAuthorization("${deployer.address}", true)`);
  console.log("\n3. Store detection results:");
  console.log("   await contract.storeDetectionResult(fileHash, isDeepfake, confidence, reason, version, processingTime)");
  
  return contractAddress;
}

// Execute deployment
main()
  .then((contractAddress) => {
    console.log(`\n🎯 Deployment completed! Contract address: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  }); 