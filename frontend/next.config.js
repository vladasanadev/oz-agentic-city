/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_NEAR_NETWORK: 'testnet',
    NEXT_PUBLIC_NEAR_NODE_URL: 'https://rpc.testnet.near.org',
    NEXT_PUBLIC_NEAR_WALLET_URL: 'https://wallet.testnet.near.org',
    NEXT_PUBLIC_AGENT_ACCOUNT: 'deepfake-agent.testnet',
    NEXT_PUBLIC_CONTRACT_ACCOUNT: 'deepfake-contract.testnet',
    NEXT_PUBLIC_APP_NAME: 'NEAR AI Deepfake Detection'
  }
};

module.exports = nextConfig; 