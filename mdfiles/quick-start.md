# ⚡ QUICK START - NEAR Shade Agents + 0G

## 🚀 Get Started in 10 Minutes

### 1. Setup NEAR Testnet
```bash
# Install NEAR CLI
npm install -g near-cli

# Login to NEAR testnet
near login
# Follow browser flow to create/connect account
```

### 2. Create Project Structure
```bash
mkdir deepfake-detector
cd deepfake-detector
mkdir contract shade-agent frontend
```

### 3. Install 0G SDK (Optional - can mock if not available)
```bash
npm install @0glabs/0g-js-sdk
# If not available, we'll simulate in demo
```

### 4. Create NEAR Smart Contract

**Create: `contract/Cargo.toml`**
```toml
[package]
name = "deepfake-detection"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

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

**Create: `contract/src/lib.rs`**
```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};
use std::collections::HashMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct DeepfakeContract {
    results: HashMap<String, DetectionResult>,
}

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub struct DetectionResult {
    file_hash: String,
    is_deepfake: bool,
    confidence: u8,
    timestamp: u64,
    agent_id: AccountId,
}

impl Default for DeepfakeContract {
    fn default() -> Self {
        Self {
            results: HashMap::new(),
        }
    }
}

#[near_bindgen]
impl DeepfakeContract {
    pub fn store_agent_result(
        &mut self,
        file_hash: String,
        is_deepfake: bool,
        confidence: u8,
    ) {
        let result = DetectionResult {
            file_hash: file_hash.clone(),
            is_deepfake,
            confidence,
            timestamp: env::block_timestamp(),
            agent_id: env::predecessor_account_id(),
        };
        self.results.insert(file_hash, result);
    }

    pub fn get_result(&self, file_hash: String) -> Option<DetectionResult> {
        self.results.get(&file_hash).cloned()
    }
    
    pub fn get_total_scans(&self) -> u64 {
        self.results.len() as u64
    }

    pub fn request_detection(&mut self, file_hash: String) -> Promise {
        Promise::new("your-agent.testnet".parse().unwrap())
            .function_call(
                "process_detection".to_string(),
                format!(r#"{{"file_hash": "{}"}}"#, file_hash),
                0,
                5_000_000_000_000,
            )
    }
}
```

### 5. Setup Rust (if needed)
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

### 6. Deploy Contracts
```bash
# Build and deploy main contract
cd contract
cargo build --target wasm32-unknown-unknown --release
near deploy --wasmFile target/wasm32-unknown-unknown/release/deepfake_detection.wasm --accountId your-contract.testnet

# You'll create the Shade Agent next following the full plan
```

### 7. Test Contract
```bash
# Test basic functionality
near view your-contract.testnet get_total_scans '{}'
# Should return 0 initially
```

### 8. Create React App
```bash
cd frontend
npx create-react-app .
npm install near-api-js @0glabs/0g-js-sdk
npm start
```

## ✅ If NEAR CLI Works - You're Ready!

Now you can:
1. Follow `NEAR_SHADE_PLAN.md` for complete implementation
2. Build the Shade Agent
3. Create the full frontend
4. Record your innovative demo video

**This is cutting-edge tech - you'll be among the first to demo NEAR Shade Agents! 🚀**

## 🆘 Troubleshooting

**Contract build fails?**
```bash
# Make sure you're in contract directory
cd contract
# Check Rust is installed
rustc --version
# Install target if missing
rustup target add wasm32-unknown-unknown
```

**Deploy fails?**
```bash
# Make sure you're logged in
near login
# Check your account has NEAR tokens
near state YOUR_ACCOUNT.testnet
```

**Can't call contract?**
```bash
# Check contract deployed
near view YOUR_ACCOUNT.testnet get_total_scans '{}'
# If this works, contract is deployed correctly
```

## 🎯 Success Checklist

- [ ] Contract deployed to testnet
- [ ] Can store detection results
- [ ] Can retrieve results
- [ ] Ready for frontend integration

**You're on track! Keep going! 🚀** 