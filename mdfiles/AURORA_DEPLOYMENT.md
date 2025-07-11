# 🚀 Aurora Deployment Guide

## 🚨 IMPORTANT: Network Selection

The error you're seeing is because the contract was deployed on **Remix VM (local)** instead of **Aurora Testnet**. 

### Step 1: Switch to Aurora Testnet in Remix

1. In Remix, go to **Deploy & Run Transactions** tab
2. **CRITICAL**: Change Environment from "Remix VM (Prague)" to **"Injected Provider - MetaMask"**
3. Make sure MetaMask is connected to **Aurora Testnet** (not Ethereum mainnet!)
4. Verify the network shows as "Aurora Testnet" in both Remix and MetaMask

### Step 2: Get Aurora Testnet ETH

1. Visit Aurora Faucet: https://aurora.dev/faucet
2. Connect your MetaMask wallet
3. Request free testnet ETH (needed for deployment)

### Step 3: Deploy Contract on Aurora Testnet

1. In Remix, with **"Injected Provider - MetaMask"** selected
2. Deploy the `DeepfakeDetector` contract
3. Confirm the transaction in MetaMask
4. **Copy the deployed contract address** (starts with 0x...)

### Step 4: Update Frontend with New Contract Address

Replace the contract address in `deepfake-detector/frontend/src/App.tsx`:

```javascript
const CONTRACT_ADDRESS = "YOUR_NEW_AURORA_CONTRACT_ADDRESS_HERE";
```

### Step 5: Authorize the Agent

1. In Remix, under "Deployed Contracts"
2. Find your deployed contract
3. Call `authorizeAgent` with:
   - agent: `0x4760BE048b9ca8D32AA3Cd541e0839715179619f`
   - agentId: `"aurora-ai-agent-001"`

### Step 6: Start the Autonomous Agent

```bash
cd deepfake-detector/agent-service
node autonomous-agent.js YOUR_NEW_AURORA_CONTRACT_ADDRESS_HERE 0x6b7e364566512af7cb9354ce44a3e5c94906624ed87378bbe40240ed3e8365c1
```

### Step 7: Test the System

1. Start the React frontend: `npm start`
2. Connect MetaMask (make sure it's on Aurora Testnet)
3. Upload a file for detection
4. The agent should process it and return results!

## 🔧 Troubleshooting

- **"Could not decode result data"**: Contract deployed on wrong network
- **"Timeout waiting for result"**: Agent not running or not authorized
- **"Only authorized agents"**: Run `authorizeAgent` function first

## ✅ Success Indicators

- Contract address starts with `0x...` and shows on Aurora testnet
- Agent console shows "🎯 Listening for detection requests..."
- Frontend shows "🟢 Agent Online" status
- File uploads get processed and return results

The key fix is deploying on **Aurora Testnet** via **Injected Provider**, not Remix VM!

## Step 1: Setup Metamask for Aurora Testnet

### Add Aurora Testnet to Metamask:
1. Open Metamask
2. Click "Add Network" 
3. Add Custom Network:
   - **Network Name**: Aurora Testnet
   - **RPC URL**: `https://testnet.aurora.dev`
   - **Chain ID**: `1313161555`
   - **Currency Symbol**: ETH
   - **Explorer**: `https://testnet.aurorascan.dev`

### Get Test ETH:
- Visit: https://aurora.dev/faucet
- Connect your Metamask
- Request test ETH for Aurora testnet

## Step 2: Deploy via Remix

### Open Remix IDE:
1. Go to: https://remix.ethereum.org/
2. Create new file: `DeepfakeDetector.sol`
3. Copy our contract code from `contracts/DeepfakeDetector.sol`

### Compile:
1. Go to "Solidity Compiler" tab
2. Select Solidity version: `0.8.19`
3. Click "Compile DeepfakeDetector.sol"

### Deploy:
1. Go to "Deploy & Run Transactions" tab
2. Environment: **Injected Provider - MetaMask**
3. Make sure Aurora Testnet is selected in Metamask
4. Contract: **DeepfakeDetector**
5. Click **Deploy**
6. Confirm transaction in Metamask

### After Deployment:
1. **Copy contract address** - you'll need it!
2. **Test basic functions** in Remix
3. **View on Aurora Explorer**

## Step 3: Test Contract

### In Remix, test these functions:
```solidity
// Check initial state
getTotalScans() // Should return 0

// Authorize yourself as an agent (as owner)
authorizeAgent("YOUR_METAMASK_ADDRESS", "TestAgent1")

// Check authorization
isAgentAuthorized("YOUR_METAMASK_ADDRESS") // Should return true
```

## Step 4: Save Info

**Contract Address**: `0x...` (copy from Remix)
**Aurora Explorer**: `https://testnet.aurorascan.dev/address/YOUR_CONTRACT_ADDRESS`
**Network**: Aurora Testnet
**Chain ID**: 1313161555

---

## ✅ Success Criteria:
- [ ] Aurora testnet added to Metamask
- [ ] Test ETH received
- [ ] Contract deployed successfully
- [ ] Contract address saved
- [ ] Basic functions tested

**Ready for Hour 3: Autonomous Agent Service! 🤖** 