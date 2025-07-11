# NEAR Social: Testnet vs Mainnet Guide

## 🎯 **The Key Question: Where Will My Posts Appear?**

**Short Answer**: Posts to **testnet** won't appear on **near.social** (mainnet website), but they're real blockchain transactions that can be verified.

## 🔍 **Network Separation**

### **Your App (Development)**
```javascript
Contract: v1.social08.testnet
Network: NEAR Testnet
Purpose: Safe testing environment
```

### **near.social Website**
```javascript
Contract: social.near
Network: NEAR Mainnet  
Purpose: Production social network
```

### **Why They're Separate**
- **Safety**: Test without affecting mainnet
- **Cost**: Testnet transactions are free
- **Development**: Iterate safely before production

## ✅ **How to Verify Testnet Posts**

### **1. NEAR Explorer (Recommended)**
When you successfully post, check:
```bash
https://explorer.testnet.near.org/transactions/YOUR_TX_HASH
```

**What to Look For:**
- ✅ Transaction status: Success
- ✅ Contract called: `v1.social08.testnet`
- ✅ Method: `set`
- ✅ Your post data in transaction details

### **2. In Your App**
**Real Testnet Post:**
- ✅ Success message: "Posted to NEAR Social testnet blockchain!"
- ✅ Blue "View on Explorer" link
- ✅ Transaction hash shown
- ❌ No "Test" badge

**Mock Fallback:**
- 🔄 Success message: "Saved to test data (mock mode)!"
- 🔄 Yellow "Test Data (Mock)" indicator
- 🔄 Mock transaction hash
- ✅ "Test" badge visible

### **3. Direct Contract Query**
```bash
# Query the testnet contract for your posts:
curl -d '{
  "jsonrpc": "2.0",
  "id": "dontcare", 
  "method": "query",
  "params": {
    "request_type": "call_function",
    "finality": "final",
    "account_id": "v1.social08.testnet",
    "method_name": "get", 
    "args_base64": "BASE64_ENCODED_QUERY"
  }
}' -H 'Content-Type: application/json' https://rpc.testnet.near.org
```

## 🚀 **Development → Production Path**

### **Current (Testnet Development)**
```javascript
✅ Test all features safely
✅ Real blockchain transactions  
✅ Verify on testnet explorer
❌ Won't appear on near.social website
```

### **Future (Mainnet Production)**
```javascript
✅ Posts appear on near.social
✅ Real user community
✅ Permanent blockchain storage
💰 Requires real NEAR tokens
```

### **Migration Process**
1. **Test thoroughly** on testnet (current)
2. **Deploy to mainnet** (`social.near` contract)
3. **Update app config** for production
4. **Real community posts** on near.social

## 🎯 **Success Verification Checklist**

### **✅ Real Testnet Post**
- [ ] App shows "Posted to NEAR Social testnet blockchain!"
- [ ] Transaction hash provided
- [ ] "View on Explorer" link works
- [ ] Explorer shows successful transaction to `v1.social08.testnet`
- [ ] No "Test" badge on post

### **🔄 Mock Fallback** 
- [ ] App shows "Saved to test data (mock mode)!"
- [ ] "Test Data (Mock)" indicator shown
- [ ] "Test" badge on community posts
- [ ] Mock transaction hash (starts with "mock-")

## 📋 **Common Questions**

### **Q: Why don't I see my posts on near.social?**
**A**: You're posting to testnet (`v1.social08.testnet`), but near.social shows mainnet posts (`social.near`). This is expected for development.

### **Q: How do I know if my testnet post worked?**
**A**: Check the NEAR Explorer link provided after posting. Look for successful transaction to `v1.social08.testnet`.

### **Q: When will posts appear on near.social?**
**A**: When you deploy to mainnet and use the `social.near` contract instead of `v1.social08.testnet`.

### **Q: Is testnet posting "real"?**
**A**: Yes! It's a real blockchain transaction on NEAR testnet. It's just on a different network than the main near.social website.

## 🛠️ **Developer Tools**

### **Verify Testnet Posts in Console**
```javascript
import { verifyTestnetPost } from './utils/near-social';

// Check if your post exists on testnet
const result = await verifyTestnetPost('your-account.testnet', timestamp);
console.log('Post verification:', result);
```

### **Environment Switching**
```javascript
// Current: Testnet
const SOCIAL_CONTRACT = 'v1.social08.testnet';

// Future: Mainnet  
const SOCIAL_CONTRACT = 'social.near';
```

## 🎉 **Bottom Line**

Your testnet posts are **real blockchain transactions** that prove your social features work perfectly! They just live on testnet instead of mainnet, which is exactly what you want for development and testing.

When ready for production, simply switch to mainnet configuration and your posts will appear on the main near.social website. 