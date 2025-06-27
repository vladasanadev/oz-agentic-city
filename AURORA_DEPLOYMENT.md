# 🚀 Aurora Deployment Guide

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