# NEAR Social Configuration Guide

## Quick Setup Options

### Option 1: Try Real NEAR Social (Recommended)
The app will automatically try to use the real NEAR Social contract:
- **Testnet**: `v1.social08.testnet`
- **Mainnet**: `social.near`

Just run the app normally - it will automatically fall back to mock mode if the contract isn't available.

### Option 2: Force Mock Mode (For Testing)
If you want to test the social features without connecting to NEAR Social:

1. Create a `.env.local` file in the `shade-agent1` directory:
```bash
# Enable mock mode for testing
NEXT_PUBLIC_USE_MOCK_SOCIAL=true
```

2. Restart your development server:
```bash
npm run dev
```

## How It Works

### Smart Fallback System
The app tries real NEAR Social testnet contract first, then falls back as needed:
- ✅ **Real NEAR Social Testnet**: Uses v1.social08.testnet for real blockchain storage
- 🔄 **Automatic Fallback**: Uses sample data when gas limits exceeded or contract unavailable
- 🔄 **Per-Request Fallback**: Each request tries real contract first, no permanent mock mode

### Mock Mode Features
When using mock mode, you get:
- Sample community posts (Alice & Bob examples)
- Functional sharing (stored in memory)
- Working like functionality
- Community statistics
- All UI components work normally

### Error Handling
The app gracefully handles:
- Contract not found errors
- Network connectivity issues
- Wallet connection problems
- Transaction failures

## Testing Social Features

### 1. Test Sharing
1. Upload and analyze media
2. Click "Share on NEAR Social" 
3. Add custom message (optional)
4. Share results

### 2. Test Community Feed
1. Navigate to "Community" page
2. View shared detection results
3. Filter by authentic/deepfake
4. Search posts and authors
5. Like community posts

### 3. Test Statistics
Community stats show:
- Total detections
- Deepfake vs authentic ratio
- Active contributors
- Recent activity (24h)

## Production Deployment

For production, ensure:
- Set `NODE_ENV=production` 
- Remove `NEXT_PUBLIC_USE_MOCK_SOCIAL=true`
- Use mainnet NEAR wallet connection
- Test with real NEAR Social contract

## Troubleshooting

### "Gas Limit Exceeded" Error
- **Common**: NEAR Social queries with wildcards (`*`) are expensive
- **Solution**: App automatically falls back to mock mode with sample data
- **Why**: Querying all posts from all users exceeds blockchain gas limits
- **Fix**: Use targeted queries or wait for NEAR Social optimization

### "Social contract not available" Error
- **Expected**: Contract doesn't exist on testnet
- **Solution**: App automatically falls back to mock mode

### Mock Mode Not Working
- Check console logs for "Mock:" prefixed messages
- Verify `.env.local` file is properly formatted
- Restart development server

### Real NEAR Social Issues
- Check network connection
- Verify wallet is connected
- Ensure sufficient NEAR balance for transactions
- Check contract address is correct for your network

### Gas Limit Solutions
1. **Immediate**: Use mock mode (automatic fallback)
2. **Short-term**: Query specific known accounts instead of wildcards
3. **Long-term**: Use NEAR Social indexer or build custom social contract

## Environment Variables

Create `.env.local` file with:
```bash
# Force mock mode (optional)
NEXT_PUBLIC_USE_MOCK_SOCIAL=true

# Production mode
NODE_ENV=production
```

## Next Steps

Once social features are working, you can:
1. Deploy to testnet/mainnet
2. Create custom social contract
3. Add more community features
4. Integrate with BOS components 