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

### Automatic Fallback Mode
The app automatically detects if NEAR Social contract is available:
- ✅ **Real NEAR Social**: Uses blockchain storage, real transactions
- 🔄 **Mock Mode**: Uses in-memory storage, fake transactions (for testing)

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