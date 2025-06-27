const crypto = require('crypto');

// Test the mock AI detection logic
function testMockDetection() {
  console.log("🧪 Testing Mock AI Detection Logic");
  console.log("=====================================\n");

  // Create a dummy agent instance just for testing the detection logic
  const testAgent = {
    mockAIDetection: function(filename, fileHash) {
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
  };

  // Test cases
  const testCases = [
    { filename: "deepfake_video.mp4", description: "Should detect as deepfake (filename)" },
    { filename: "fake_person.jpg", description: "Should detect as deepfake (filename)" },
    { filename: "synthetic_audio.wav", description: "Should detect as deepfake (filename)" },
    { filename: "real_photo.jpg", description: "Should detect as authentic (filename)" },
    { filename: "authentic_video.mp4", description: "Should detect as authentic (filename)" },
    { filename: "original_audio.wav", description: "Should detect as authentic (filename)" },
    { filename: "random_file.jpg", description: "Random detection based on hash" },
    { filename: "test_image.png", description: "Random detection based on hash" },
    { filename: "sample_video.mp4", description: "Random detection based on hash" }
  ];

  testCases.forEach((testCase, index) => {
    // Generate a mock hash
    const hash = crypto.createHash('sha256').update(`${testCase.filename}_${index}`).digest('hex');
    
    const result = testAgent.mockAIDetection(testCase.filename, hash);
    
    console.log(`📁 File: ${testCase.filename}`);
    console.log(`   Hash: ${hash.substring(0, 16)}...`);
    console.log(`   Result: ${result.isDeepfake ? '⚠️ DEEPFAKE' : '✅ AUTHENTIC'}`);
    console.log(`   Confidence: ${result.confidence}%`);
    console.log(`   Description: ${testCase.description}`);
    console.log("");
  });

  console.log("✅ Mock AI detection test completed!\n");
}

// Test file hash generation
function testFileHashing() {
  console.log("🔐 Testing File Hash Generation");
  console.log("===============================\n");

  const testData = [
    "This is a test file content",
    "Another test file with different content",
    "Deepfake video content simulation"
  ];

  testData.forEach((content, index) => {
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    console.log(`📄 Test Content ${index + 1}:`);
    console.log(`   Content: "${content}"`);
    console.log(`   SHA-256: ${hash}`);
    console.log("");
  });

  console.log("✅ File hashing test completed!\n");
}

// Test agent ID generation
function testAgentId() {
  console.log("🤖 Testing Agent ID Generation");
  console.log("==============================\n");

  for (let i = 0; i < 5; i++) {
    const agentId = `Agent_${crypto.randomBytes(4).toString('hex')}`;
    console.log(`🆔 Generated Agent ID: ${agentId}`);
  }

  console.log("\n✅ Agent ID generation test completed!\n");
}

// Main test function
async function runTests() {
  console.log("🚀 Aurora Autonomous Agent - Local Testing");
  console.log("==========================================\n");

  testAgentId();
  testFileHashing();
  testMockDetection();

  console.log("🎉 All tests completed successfully!");
  console.log("\n📋 Next Steps:");
  console.log("1. Deploy contract to Aurora using Remix IDE");
  console.log("2. Update CONTRACT_ADDRESS in autonomous-agent.js");
  console.log("3. Run: node autonomous-agent.js <CONTRACT_ADDRESS> <PRIVATE_KEY>");
  console.log("4. Start React frontend and test the complete flow");
}

// Run tests if called directly
if (require.main === module) {
  runTests();
} 