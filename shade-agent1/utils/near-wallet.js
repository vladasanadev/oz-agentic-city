import { connect, keyStores, WalletConnection } from 'near-api-js';

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// NEAR configuration for testnet
const nearConfig = {
  networkId: 'testnet',
  keyStore: isBrowser ? new keyStores.BrowserLocalStorageKeyStore() : null,
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://testnet.mynearwallet.com',  // Updated to new wallet URL
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
  contractName: process.env.NEXT_PUBLIC_contractId || 'deepfake-detector.testnet',
  appTitle: 'NEAR Shade Agent: Deepfake Detection'
};

let nearConnection = null;
let walletConnection = null;

// Initialize NEAR connection
export async function initializeNEAR() {
  if (!isBrowser) {
    throw new Error('NEAR wallet can only be initialized in browser environment');
  }
  
  if (!nearConnection) {
    try {
      nearConnection = await connect(nearConfig);
      walletConnection = new WalletConnection(nearConnection, 'deepfake-detector');
      console.log('✅ NEAR connection initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize NEAR connection:', error);
      throw error;
    }
  }
  return { nearConnection, walletConnection };
}

// Get wallet connection instance
export async function getWallet() {
  if (!walletConnection) {
    await initializeNEAR();
  }
  return walletConnection;
}

// Check if user is signed in
export async function isSignedIn() {
  const wallet = await getWallet();
  return wallet.isSignedIn();
}

// Get current account ID
export async function getAccountId() {
  const wallet = await getWallet();
  return wallet.getAccountId();
}

// Sign in to NEAR wallet
export async function signIn() {
  const wallet = await getWallet();
  
  // For now, sign in without contract to avoid issues
  // We can add contract-specific permissions later when we deploy smart contracts
  const signInOptions = {
    successUrl: window.location.origin,
    failureUrl: window.location.origin
    // Removing contractId to avoid 404 errors when account has no deployed contract
  };
  
  console.log('🔗 Initiating NEAR wallet sign in...', signInOptions);
  
  return wallet.requestSignIn(signInOptions);
}

// Sign out of NEAR wallet
export async function signOut() {
  const wallet = await getWallet();
  wallet.signOut();
  // Reload page to reset state
  window.location.replace(window.location.origin);
}

// Handle wallet callback after sign in
export async function handleWalletCallback() {
  if (!isBrowser) return false;
  
  try {
    const wallet = await getWallet();
    
    // Check if this is a callback from wallet
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account_id');
    const publicKey = urlParams.get('public_key');
    
    if (accountId && publicKey) {
      console.log('🔗 Processing wallet callback...', { accountId, publicKey });
      
      // Clean up URL
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error handling wallet callback:', error);
    return false;
  }
}

// Get account balance
export async function getBalance(accountId = null) {
  try {
    const wallet = await getWallet();
    const account = accountId ? 
      await nearConnection.account(accountId) : 
      wallet.account();
    
    const balance = await account.getAccountBalance();
    return {
      total: balance.total,
      available: balance.available,
      staked: balance.staked,
      stateStaked: balance.stateStaked,
      // Convert to NEAR (from yoctoNEAR)
      totalNEAR: (parseFloat(balance.total) / 1e24).toFixed(4),
      availableNEAR: (parseFloat(balance.available) / 1e24).toFixed(4)
    };
  } catch (error) {
    console.error('Error getting balance:', error);
    return {
      total: '0',
      available: '0',
      staked: '0',
      stateStaked: '0',
      totalNEAR: '0.0000',
      availableNEAR: '0.0000',
      error: error.message
    };
  }
}

// Get account details
export async function getAccountDetails(accountId = null) {
  try {
    const wallet = await getWallet();
    const account = accountId ? 
      await nearConnection.account(accountId) : 
      wallet.account();
    
    const [accountState, balance] = await Promise.all([
      account.state(),
      getBalance(accountId)
    ]);
    
    return {
      accountId: account.accountId,
      balance: balance,
      state: accountState,
      createdAt: accountState.created ? new Date(accountState.created / 1000000).toISOString() : null,
      storageUsage: accountState.storage_usage || 0
    };
  } catch (error) {
    console.error('Error getting account details:', error);
    return {
      accountId: accountId || 'unknown',
      balance: {
        totalNEAR: '0.0000',
        availableNEAR: '0.0000',
        error: error.message
      },
      error: error.message
    };
  }
}

// Check if account exists
export async function accountExists(accountId) {
  try {
    const account = await nearConnection.account(accountId);
    await account.state();
    return true;
  } catch (error) {
    return false;
  }
}

// Format NEAR amount for display
export function formatNEAR(amount, decimals = 4) {
  if (typeof amount === 'string') {
    const nearAmount = parseFloat(amount) / 1e24;
    return nearAmount.toFixed(decimals);
  }
  return amount.toFixed(decimals);
}

// Parse NEAR amount to yoctoNEAR
export function parseNEAR(amount) {
  return (parseFloat(amount) * 1e24).toString();
}

// Get wallet connection status
export async function getWalletStatus() {
  // Return disconnected state for SSR
  if (!isBrowser) {
    return {
      connected: false,
      accountId: null,
      balance: null,
      error: null
    };
  }

  try {
    const wallet = await getWallet();
    const isConnected = wallet.isSignedIn();
    
    if (!isConnected) {
      return {
        connected: false,
        accountId: null,
        balance: null,
        error: null
      };
    }
    
    const accountId = wallet.getAccountId();
    const balance = await getBalance();
    
    return {
      connected: true,
      accountId: accountId,
      balance: balance,
      error: null
    };
  } catch (error) {
    console.error('Error getting wallet status:', error);
    return {
      connected: false,
      accountId: null,
      balance: null,
      error: error.message
    };
  }
}

// Handle wallet connection errors
export function handleWalletError(error) {
  console.error('NEAR Wallet Error:', error);
  
  if (error.message.includes('User rejected')) {
    return 'User rejected the connection request';
  } else if (error.message.includes('Network')) {
    return 'Network connection error. Please check your internet connection.';
  } else if (error.message.includes('Account')) {
    return 'Account not found or invalid';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
}

// Event listeners for wallet state changes
export function onWalletStateChange(callback) {
  // Return no-op function for SSR
  if (!isBrowser) {
    return () => {};
  }
  
  // Listen for wallet connection changes
  const interval = setInterval(async () => {
    const status = await getWalletStatus();
    callback(status);
  }, 5000); // Check every 5 seconds
  
  return () => clearInterval(interval);
}

// Export configuration for debugging
export { nearConfig }; 