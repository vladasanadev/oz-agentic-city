# 1-Day NEAR Shade Agent + 0G Network MVP

> **⚡ Modern Stack**: NEAR Shade Agents + 0G Storage + React Frontend

## 🎯 What We'll Build

- React app that uploads files to 0G Network
- NEAR Shade Agent that "detects" deepfakes (mock AI)
- Simple NEAR smart contract to store results
- End-to-end demo showing autonomous AI agent

**Innovation**: First hackathon demo of NEAR Shade Agents + 0G integration!

---

## ⏰ Hour-by-Hour Implementation

### 🌅 **Hour 1: NEAR + 0G Setup** (9:00-10:00 AM)

**Goal**: Get NEAR testnet + 0G Network working

**NEAR Setup:**
```bash
# Install NEAR CLI
npm install -g near-cli

# Login to NEAR testnet
near login
# Follow browser flow to create/connect testnet account
```

**0G Network Setup:**
```bash
# Install 0G SDK
npm install @0glabs/0g-js-sdk

# Get 0G testnet access (if available) or prepare for mock
# 0G is cutting edge, so we may need to simulate
```

**Backup Plan**: If 0G isn't accessible, we'll simulate with local storage + show concept

**Deliverable**: NEAR testnet account + 0G access ready

---

### 🔧 **Hour 2: NEAR Smart Contract** (10:00-11:00 AM)

**Goal**: Simple contract for detection results

**File: `contract/src/lib.rs`**
```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
use std::collections::HashMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct DeepfakeContract {
    results: HashMap<String, DetectionResult>,
    authorized_agents: Vec<AccountId>,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct DetectionResult {
    file_hash: String,
    filename: String,
    is_deepfake: bool,
    confidence: u8,
    timestamp: u64,
    agent_id: AccountId,
    storage_hash: String, // 0G storage reference
}

impl Default for DeepfakeContract {
    fn default() -> Self {
        Self {
            results: HashMap::new(),
            authorized_agents: Vec::new(),
        }
    }
}

#[near_bindgen]
impl DeepfakeContract {
    #[init]
    pub fn new() -> Self {
        Self::default()
    }

    // Agent calls this to store detection results
    pub fn store_agent_result(
        &mut self,
        file_hash: String,
        filename: String,
        is_deepfake: bool,
        confidence: u8,
        storage_hash: String,
    ) {
        let result = DetectionResult {
            file_hash: file_hash.clone(),
            filename,
            is_deepfake,
            confidence,
            timestamp: env::block_timestamp(),
            agent_id: env::predecessor_account_id(),
            storage_hash,
        };
        
        self.results.insert(file_hash, result);
    }

    // Frontend calls this to get results
    pub fn get_result(&self, file_hash: String) -> Option<DetectionResult> {
        self.results.get(&file_hash).cloned()
    }

    pub fn get_total_scans(&self) -> u64 {
        self.results.len() as u64
    }

    // Request detection from agent
    pub fn request_detection(&mut self, file_hash: String, storage_hash: String) -> Promise {
        // Cross-contract call to Shade Agent
        Promise::new("your-agent.testnet".parse().unwrap())
            .function_call(
                "process_detection".to_string(),
                format!(r#"{{"file_hash": "{}", "storage_hash": "{}"}}"#, file_hash, storage_hash),
                0,
                5_000_000_000_000, // 5 TGas
            )
    }
}
```

**File: `contract/Cargo.toml`**
```toml
[package]
name = "deepfake-detection"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
near-sdk = "4.0.0"

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"
overflow-checks = true
```

**Deliverable**: Smart contract code ready

---

### 🤖 **Hour 3: Shade Agent** (11:00-12:00 PM)

**Goal**: Deploy autonomous AI agent

**File: `shade-agent/src/lib.rs`**
```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, Promise, Gas};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct DeepfakeAgent {
    contract_id: String,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct DetectionRequest {
    file_hash: String,
    storage_hash: String,
}

#[near_bindgen]
impl DeepfakeAgent {
    #[init]
    pub fn new(contract_id: String) -> Self {
        Self { contract_id }
    }

    // This is called by the main contract
    pub fn process_detection(&mut self, file_hash: String, storage_hash: String) -> Promise {
        // Mock AI detection logic
        let detection_result = self.mock_ai_detection(&file_hash);
        
        // Store result back to main contract
        Promise::new(self.contract_id.parse().unwrap())
            .function_call(
                "store_agent_result".to_string(),
                serde_json::to_string(&serde_json::json!({
                    "file_hash": file_hash,
                    "filename": "detected_file.jpg",
                    "is_deepfake": detection_result.is_deepfake,
                    "confidence": detection_result.confidence,
                    "storage_hash": storage_hash
                })).unwrap(),
                0,
                Gas(5_000_000_000_000),
            )
    }

    // Mock AI detection - in real version this would be complex AI
    fn mock_ai_detection(&self, file_hash: &str) -> MockDetectionResult {
        // Simple hash-based mock logic
        let hash_sum: u32 = file_hash.chars()
            .map(|c| c as u32)
            .sum();
        
        let is_deepfake = (hash_sum % 4) == 0; // 25% chance deepfake
        let confidence = if is_deepfake {
            75 + (hash_sum % 20) as u8 // 75-95% for deepfakes
        } else {
            85 + (hash_sum % 10) as u8 // 85-95% for authentic
        };
        
        MockDetectionResult {
            is_deepfake,
            confidence,
        }
    }
}

struct MockDetectionResult {
    is_deepfake: bool,
    confidence: u8,
}
```

**Deploy Commands:**
```bash
# Build main contract
cd contract
cargo build --target wasm32-unknown-unknown --release
near deploy --wasmFile target/wasm32-unknown-unknown/release/deepfake_detection.wasm --accountId your-contract.testnet

# Build and deploy agent
cd ../shade-agent
cargo build --target wasm32-unknown-unknown --release
near deploy --wasmFile target/wasm32-unknown-unknown/release/deepfake_agent.wasm --accountId your-agent.testnet

# Initialize contracts
near call your-contract.testnet new '{}' --accountId your-contract.testnet
near call your-agent.testnet new '{"contract_id": "your-contract.testnet"}' --accountId your-agent.testnet
```

**Deliverable**: Working Shade Agent + Contract integration

---

### ✅ **Hour 4: Test Integration** (12:00-1:00 PM)

**Goal**: Verify agent + contract communication

**Test Commands:**
```bash
# Test detection request
near call your-contract.testnet request_detection '{"file_hash": "test123", "storage_hash": "0g_hash_123"}' --accountId your-account.testnet --gas 10000000000000

# Check result (wait a few seconds)
near view your-contract.testnet get_result '{"file_hash": "test123"}'

# Check total scans
near view your-contract.testnet get_total_scans '{}'
```

**Deliverable**: Working cross-contract calls between agent and main contract

---

### 🎨 **Hour 5: React Frontend** (1:00-2:00 PM)

**Goal**: Create React app with NEAR integration

```bash
npx create-react-app deepfake-detector
cd deepfake-detector
npm install near-api-js @0glabs/0g-js-sdk
```

**File: `src/App.js`**
```jsx
import React, { useState, useEffect } from 'react';
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js';
import './App.css';

const config = {
  networkId: 'testnet',
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

function App() {
  const [near, setNear] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [accountId, setAccountId] = useState('');
  const [totalScans, setTotalScans] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    initNear();
  }, []);

  const initNear = async () => {
    const nearConnection = await connect(config);
    const walletConnection = new WalletConnection(nearConnection, 'deepfake-detector');
    
    setNear(nearConnection);
    setWallet(walletConnection);
    
    if (walletConnection.isSignedIn()) {
      setAccountId(walletConnection.getAccountId());
      
      const contractInstance = new Contract(
        walletConnection.account(),
        'your-contract.testnet', // Replace with your contract
        {
          viewMethods: ['get_result', 'get_total_scans'],
          changeMethods: ['request_detection'],
        }
      );
      setContract(contractInstance);
      
      // Get total scans
      const scans = await contractInstance.get_total_scans();
      setTotalScans(scans);
    }
  };

  const signIn = () => {
    wallet.requestSignIn({
      contractId: 'your-contract.testnet',
      methodNames: ['request_detection'],
    });
  };

  const signOut = () => {
    wallet.signOut();
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔍 NEAR AI Deepfake Detector</h1>
        <p>Powered by Shade Agents + 0G Network</p>
        
        {accountId ? (
          <div>
            <p>Connected: {accountId}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={signIn}>Connect NEAR Wallet</button>
        )}
        
        <div className="stats">
          <p>Total AI scans by agents: {totalScans}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
```

**Deliverable**: React app with NEAR Wallet connection

---

### ⚡ **Hour 6: File Upload + 0G Integration** (2:00-3:00 PM)

**Add to `src/App.js`:**

```jsx
// Add these imports
import { ZeroGStorage } from '@0glabs/0g-js-sdk'; // or mock if not available

// Add file upload handler
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !contract) return;
  
  setIsProcessing(true);
  setResult(null);
  
  try {
    // Upload to 0G Network (or simulate)
    const fileBuffer = await file.arrayBuffer();
    const fileHash = await calculateHash(fileBuffer);
    
    // Upload to 0G (mock for now)
    const storageHash = await uploadTo0G(fileBuffer, file.name);
    
    // Request detection from Shade Agent
    await contract.request_detection({
      file_hash: fileHash,
      storage_hash: storageHash
    });
    
    // Poll for result
    pollForResult(fileHash);
    
  } catch (error) {
    console.error('Upload failed:', error);
    setIsProcessing(false);
  }
};

// Helper functions
const calculateHash = async (buffer) => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const uploadTo0G = async (buffer, filename) => {
  // Mock 0G upload for demo
  return `0g_${Date.now()}_${filename}`;
};

const pollForResult = async (fileHash) => {
  const maxAttempts = 10;
  let attempts = 0;
  
  const poll = async () => {
    try {
      const result = await contract.get_result({ file_hash: fileHash });
      if (result) {
        setResult(result);
        setIsProcessing(false);
        
        // Update total scans
        const scans = await contract.get_total_scans();
        setTotalScans(scans);
        return;
      }
    } catch (error) {
      console.log('Polling...', error);
    }
    
    attempts++;
    if (attempts < maxAttempts) {
      setTimeout(poll, 2000); // Poll every 2 seconds
    } else {
      setIsProcessing(false);
    }
  };
  
  poll();
};

// Add JSX for file upload (add to return statement)
<div className="upload-section">
  <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
    <h3>📁 Upload for AI Detection</h3>
    <p>Files stored on 0G Network, analyzed by Shade Agent</p>
    <input
      type="file"
      id="fileInput"
      accept="image/*,video/*"
      onChange={handleFileUpload}
      style={{ display: 'none' }}
    />
  </div>
  
  {isProcessing && (
    <div className="loading">
      <p>🤖 Shade Agent is analyzing your file...</p>
      <p>⏳ Autonomous AI processing in progress...</p>
    </div>
  )}
  
  {result && (
    <div className={`result ${result.is_deepfake ? 'deepfake' : 'authentic'}`}>
      <h3>
        {result.is_deepfake ? '⚠️ Deepfake Detected' : '✅ Authentic Content'}
      </h3>
      <p><strong>Confidence:</strong> {result.confidence}%</p>
      <p><strong>Agent:</strong> {result.agent_id}</p>
      <p><strong>Storage:</strong> {result.storage_hash}</p>
      <p><strong>Timestamp:</strong> {new Date(result.timestamp / 1000000).toLocaleString()}</p>
    </div>
  )}
</div>
```

**Deliverable**: Working file upload with agent processing

---

### 🔗 **Hour 7: Polish & Test** (3:00-4:00 PM)

**Goal**: Complete end-to-end testing

**Tasks:**
1. Test full workflow: Upload → 0G → Agent → Result
2. Add CSS styling for professional look
3. Error handling and edge cases
4. Performance optimization

**CSS (add to `src/App.css`):**
```css
.App {
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  color: white;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #fff;
  padding: 40px;
  border-radius: 15px;
  margin: 20px 0;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-area:hover {
  background: rgba(255,255,255,0.1);
  transform: translateY(-2px);
}

.result {
  background: rgba(255,255,255,0.15);
  padding: 25px;
  border-radius: 15px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

.authentic {
  border-left: 5px solid #10b981;
}

.deepfake {
  border-left: 5px solid #ef4444;
}

.loading {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  margin: 20px 0;
}
```

**Deliverable**: Polished, fully working prototype

---

### 🎬 **Hour 8: Demo Video** (4:00-5:00 PM)

**Goal**: Create compelling demo showcasing innovation

**Demo Script (4 minutes):**

1. **Hook (30s)**: 
   > "What if AI could autonomously detect deepfakes and prove its work on blockchain? Meet the first NEAR Shade Agent for deepfake detection!"

2. **Innovation (45s)**:
   > "This combines cutting-edge tech: NEAR Shade Agents for autonomous AI, 0G Network for decentralized storage, and blockchain verification. No human intervention needed!"

3. **Live Demo (2 min)**:
   - Show React app interface
   - Connect NEAR Wallet
   - Upload file → Show 0G storage
   - Shade Agent automatically processes
   - Results appear with agent signature
   - Show NEAR Explorer transactions

4. **Technical Magic (30s)**:
   > "The Shade Agent runs autonomously, analyzes files, and stores results on-chain. Everything is verifiable and decentralized."

5. **Future Vision (15s)**:
   > "Scale to real AI models, multiple agents, cross-chain deployment. The future of verifiable AI is here!"

**Recording Tips:**
- Use screen recording + webcam
- Show both frontend and NEAR Explorer
- Highlight the autonomous agent aspect
- Emphasize the innovation combination

**Deliverable**: Professional demo video for hackathon submission

---

## 🎯 Final Success Criteria

**Technical Innovation:**
- ✅ Working NEAR Shade Agent (autonomous)
- ✅ 0G Network integration (or simulation)
- ✅ Cross-contract calls functioning
- ✅ React frontend with NEAR Wallet
- ✅ End-to-end file processing

**Demo Quality:**
- ✅ Clear autonomous AI narrative
- ✅ Shows cutting-edge tech stack
- ✅ Working prototype demonstration
- ✅ Verifiable blockchain transactions

**Hackathon Impact:**
- 🔥 **First demo** of NEAR Shade Agents + 0G
- 🔥 **Autonomous AI** agents working independently
- 🔥 **Verifiable results** on blockchain
- 🔥 **Modern tech stack** showcasing NEAR ecosystem

---

## 🚨 Backup Plans

**If 0G Network isn't accessible:**
- Use IPFS as storage layer
- Mock 0G calls with local storage
- Focus demo on Shade Agent autonomy

**If Shade Agent deployment is complex:**
- Simulate agent with regular contract
- Show concept with manual triggers
- Emphasize future autonomous capability

**You've got the most innovative stack possible for this hackathon! 🚀** 