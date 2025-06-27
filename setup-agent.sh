#!/bin/bash

# NEAR AI Deepfake Detection Agent Setup Script
# ==============================================

echo "🚀 Setting up NEAR AI Deepfake Detection Agent..."

# Load environment variables
if [ -f "near-agent.env" ]; then
    source near-agent.env
    echo "✅ Environment variables loaded"
else
    echo "❌ near-agent.env file not found"
    exit 1
fi

# Check if nearai CLI is installed
if ! command -v nearai &> /dev/null; then
    echo "❌ nearai CLI not found. Installing..."
    pip install nearai
fi

echo "📋 Current nearai version: $(nearai version)"

# Check if user is logged in
echo "🔐 Checking NEAR authentication..."
if [ ! -f ~/.nearai/registry/config.json ]; then
    echo "❌ Not logged in to NEAR. Please run:"
    echo "   nearai login"
    echo "   Then run this script again"
    exit 1
else
    echo "✅ NEAR authentication found"
fi

# Display agent information
echo ""
echo "🤖 Agent Information:"
echo "   Name: $AGENT_NAME"
echo "   Version: $AGENT_VERSION"
echo "   Account: $AGENT_ACCOUNT"
echo "   Description: $AGENT_DESCRIPTION"
echo "   Model: $MODEL_NAME ($MODEL_PROVIDER)"
echo ""

# Rename the agent folder to match your NEAR account (if needed)
echo "📁 Setting up agent folder structure..."
if [ ! -d "$AGENT_ACCOUNT" ]; then
    if [ -d "deepfake-agent.testnet" ]; then
        echo "   Renaming agent folder to match your account..."
        # You'll need to manually set NEAR_ACCOUNT environment variable
        # mv deepfake-agent.testnet $NEAR_ACCOUNT
        echo "   Please set NEAR_ACCOUNT environment variable and run:"
        echo "   mv deepfake-agent.testnet \$NEAR_ACCOUNT"
    fi
fi

# Test agent locally (optional)
echo "🧪 Testing agent configuration..."
if [ -f "$AGENT_PATH/agent.py" ] && [ -f "$AGENT_PATH/metadata.json" ]; then
    echo "✅ Agent files found"
    echo "   - agent.py: $(wc -l < $AGENT_PATH/agent.py) lines"
    echo "   - metadata.json: $(wc -l < $AGENT_PATH/metadata.json) lines"
else
    echo "❌ Agent files not found in $AGENT_PATH"
fi

# Deploy agent (commented out for safety)
echo ""
echo "🚀 To deploy your agent:"
echo "   1. Set your NEAR account: export NEAR_ACCOUNT=your-account.testnet"
echo "   2. Rename folder: mv deepfake-agent.testnet \$NEAR_ACCOUNT"
echo "   3. Deploy agent: nearai registry upload \$NEAR_ACCOUNT/deepfake-detector"
echo "   4. View agent: open https://app.near.ai/agents/\$NEAR_ACCOUNT/deepfake-detector"

# Show demo commands
echo ""
echo "🎯 Demo Commands:"
echo "   Test detection: echo 'analyze file_hash:abc123def456' | python $AGENT_PATH/agent.py"
echo "   Interactive mode: python $AGENT_PATH/agent.py"

# Check Rust installation for smart contract
echo ""
echo "🦀 Smart Contract Setup:"
if command -v cargo &> /dev/null; then
    echo "✅ Rust/Cargo found: $(cargo --version)"
    echo "   Contract path: $CONTRACT_PATH"
    if [ -f "$CONTRACT_PATH/Cargo.toml" ]; then
        echo "✅ Contract configuration found"
        echo "   To build: cd $CONTRACT_PATH && cargo build --target wasm32-unknown-unknown --release"
    fi
else
    echo "❌ Rust not found. Install with:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "   rustup target add wasm32-unknown-unknown"
fi

echo ""
echo "✨ Setup complete! Your NEAR AI Deepfake Detection Agent is ready!"
echo "📖 Check the documentation files for detailed setup instructions." 