const { ethers } = require('ethers');
const crypto = require('crypto');

// Aurora Testnet Configuration
const AURORA_RPC_URL = "https://testnet.aurora.dev";

// Contract ABI (simplified)
const CONTRACT_ABI = [
  "function storeResult(string fileHash, string filename, bool isDeepfake, uint8 confidence, string agentId) public",
  "function requestDetection(string fileHash, string filename) public",
  "function getResult(string fileHash) public view returns (tuple(string fileHash, string filename, bool isDeepfake, uint8 confidence, uint256 timestamp, address agent, string agentId))",
  "function isAgentAuthorized(address agent) public view returns (bool)",
  "event DetectionRequested(string indexed fileHash, string filename, address requester)",
  "event DetectionStored(string indexed fileHash, bool isDeepfake, uint8 confidence, address agent, string agentId)"
];

class AutonomousDeepfakeAgent {
  constructor(contractAddress, agentPrivateKey) {
    this.contractAddress = contractAddress;
    this.agentId = `Agent_${crypto.randomBytes(4).toString('hex')}`;
    
    // Setup provider and signer
    this.provider = new ethers.providers.JsonRpcProvider(AURORA_RPC_URL);
    this.wallet = new ethers.Wallet(agentPrivateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
    
    console.log(`🤖 Autonomous Agent initialized: ${this.agentId}`);
    console.log(`📍 Agent Address: ${this.wallet.address}`);
    console.log(`🔗 Contract: ${contractAddress}`);
  }

  // Start listening for detection requests
  async startAgent() {
    console.log(`🚀 Starting autonomous agent ${this.agentId}...`);
    
    // Check if agent is authorized
    try {
      const isAuthorized = await this.contract.isAgentAuthorized(this.wallet.address);
      if (!isAuthorized) {
        console.log("⚠️ Agent not authorized! Owner needs to authorize this agent.");
        return;
      }
      console.log("✅ Agent is authorized!");
    } catch (error) {
      console.error("❌ Error checking authorization:", error.message);
      return;
    }

    // Listen for DetectionRequested events
    this.contract.on("DetectionRequested", async (fileHash, filename, requester, event) => {
      console.log(`\n📥 Detection request received:`);
      console.log(`   File Hash: ${fileHash}`);
      console.log(`   Filename: ${filename}`);
      console.log(`   Requester: ${requester}`);
      
      await this.processDetectionRequest(fileHash, filename);
    });

    console.log("👂 Agent is now listening for detection requests...");
    console.log("   Event: DetectionRequested");
    console.log("   Press Ctrl+C to stop\n");
  }

  // Mock AI detection logic
  async processDetectionRequest(fileHash, filename) {
    console.log(`🔬 Processing detection for: ${filename}`);
    
    try {
      // Simulate AI processing delay
      console.log("⏳ AI analyzing file...");
      await this.delay(2000 + Math.random() * 3000); // 2-5 seconds
      
      // Mock AI detection based on filename and hash
      const detection = this.mockAIDetection(filename, fileHash);
      
      console.log(`🎯 Detection result:`);
      console.log(`   Is Deepfake: ${detection.isDeepfake}`);
      console.log(`   Confidence: ${detection.confidence}%`);
      
      // Store result on blockchain
      console.log("💾 Storing result on Aurora blockchain...");
      const tx = await this.contract.storeResult(
        fileHash,
        filename,
        detection.isDeepfake,
        detection.confidence,
        this.agentId
      );
      
      console.log(`📝 Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`✅ Result stored on blockchain!`);
      console.log(`🔗 View on Aurora Explorer: https://testnet.aurorascan.dev/tx/${tx.hash}\n`);
      
    } catch (error) {
      console.error(`❌ Error processing detection:`, error.message);
    }
  }

  // Mock AI detection algorithm
  mockAIDetection(filename, fileHash) {
    const name = filename.toLowerCase();
    
    // Filename-based detection rules
    if (name.includes('fake') || name.includes('deep') || name.includes('synthetic')) {
      return {
        isDeepfake: true,
        confidence: 85 + Math.floor(Math.random() * 10) // 85-95%
      };
    } else if (name.includes('real') || name.includes('authentic') || name.includes('original')) {
      return {
        isDeepfake: false,
        confidence: 90 + Math.floor(Math.random() * 8) // 90-98%
      };
    }
    
    // Hash-based pseudo-random detection
    const hashNum = parseInt(fileHash.slice(-8), 16);
    const isDeepfake = (hashNum % 4) === 0; // 25% chance of deepfake
    
    const confidence = isDeepfake ? 
      75 + Math.floor(Math.random() * 20) : // 75-95% for deepfakes
      85 + Math.floor(Math.random() * 13);  // 85-98% for authentic
    
    return { isDeepfake, confidence };
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Stop the agent
  stop() {
    console.log(`🛑 Stopping agent ${this.agentId}...`);
    this.contract.removeAllListeners();
    process.exit(0);
  }
}

// Usage example and CLI interface
async function main() {
  console.log("🚀 NEAR Aurora Autonomous Deepfake Detection Agent");
  console.log("==================================================\n");
  
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: node autonomous-agent.js <CONTRACT_ADDRESS> <AGENT_PRIVATE_KEY>");
    console.log("\nExample:");
    console.log("node autonomous-agent.js 0x1234... 0xabcd...");
    console.log("\n💡 Tip: Make sure the agent address is authorized in the contract!");
    process.exit(1);
  }
  
  const [contractAddress, agentPrivateKey] = args;
  
  try {
    const agent = new AutonomousDeepfakeAgent(contractAddress, agentPrivateKey);
    await agent.startAgent();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => agent.stop());
    
  } catch (error) {
    console.error("❌ Failed to start agent:", error.message);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = { AutonomousDeepfakeAgent };

// Run if called directly
if (require.main === module) {
  main();
} 