# Testing Real NEAR Social Testnet Integration

## ✅ Verification Steps

### 1. Check Console Logs
Open browser dev tools → Console tab, then visit `/community`:

**Expected Logs (Real Testnet):**
```
🔗 Connecting to NEAR Social: v1.social08.testnet
📡 Fetching community detection feed from real contract...
```

**vs Previous (Mock Mode):**
```
🔧 Using mock mode (explicitly enabled)
```

### 2. Verify Contract Address
The app should be using: `v1.social08.testnet` (NOT `social.near`)

### 3. Error Handling Test
If gas limits are hit, you should see:
```
⚠️ Gas limit exceeded, using mock data for this request (will retry real contract next time)
```

### 4. Refresh Behavior
- Each page refresh tries real contract again
- No permanent mock mode switching
- Fallback is per-request only

## 🔍 What Changed

### Before (Wrong):
1. Hit gas limit → permanently switch to mock mode
2. All subsequent requests use mock
3. No retry of real contract

### After (Correct):
1. Try real `v1.social08.testnet` first
2. If gas limit → fallback to mock for this request only
3. Next request tries real contract again
4. Each request is independent

## 🎯 Expected Behavior

### Community Page Load:
1. **First attempt**: Connect to `v1.social08.testnet`
2. **If successful**: Show real social data
3. **If gas limit**: Show sample data with explanation
4. **Next refresh**: Try real contract again

### Sharing Detection:
1. **Always**: Try real `v1.social08.testnet` first
2. **If successful**: Real blockchain transaction
3. **If failed**: Fallback to sample data for that share only

### Like/Comment:
1. **Always**: Try real contract first
2. **Per-action fallback**: No permanent mock mode

## 🚀 Production vs Development

### Development (Current):
- **Contract**: `v1.social08.testnet`
- **Fallback**: Sample data when needed
- **Retry**: Every request tries real contract

### Production (Future):
- **Contract**: `social.near` (mainnet)
- **Better gas optimization**: Fewer fallbacks needed
- **Real community**: Actual user posts

## 🔧 Manual Testing

### Test Real Contract:
```bash
# Connect wallet and try sharing a detection result
# Check console for: "🔗 Connecting to NEAR Social: v1.social08.testnet"
```

### Test Fallback:
```bash
# If you get gas limit errors, should see sample data
# But next refresh should try real contract again
```

### Test Mock Mode (Optional):
```bash
# Create .env.local with:
echo "NEXT_PUBLIC_USE_MOCK_SOCIAL=true" > .env.local
# Should see: "🔧 Using mock mode (explicitly enabled)"
```

## ✅ Success Criteria

- [x] Logs show real testnet contract attempts
- [x] No permanent mock mode switching
- [x] Each request tries real contract first
- [x] Clear error messages about testnet vs mock
- [x] Sample data available when needed
- [x] All features work in both modes 