import { useState, useEffect } from 'react';
import { 
  getWalletStatus, 
  signIn, 
  signOut, 
  handleWalletError,
  onWalletStateChange,
  handleWalletCallback,
  refreshWalletStatus
} from '../utils/near-wallet';

export default function NEARWalletConnect() {
  const [walletState, setWalletState] = useState({
    connected: false,
    accountId: null,
    balance: null,
    loading: true,
    error: null
  });

  // Load wallet status on component mount
  useEffect(() => {
    async function loadWalletStatus() {
      try {
        // Handle wallet callback first (if returning from wallet)
        const isCallback = await handleWalletCallback();
        if (isCallback) {
          console.log('✅ Wallet callback processed successfully');
        }
        
        const status = await getWalletStatus();
        setWalletState({
          connected: status.connected,
          accountId: status.accountId,
          balance: status.balance,
          loading: false,
          error: status.error
        });
      } catch (error) {
        console.error('Error loading wallet status:', error);
        setWalletState(prev => ({
          ...prev,
          loading: false,
          error: handleWalletError(error)
        }));
      }
    }

    loadWalletStatus();

    // Set up wallet state change listener (reduced frequency to avoid rate limiting)
    const unsubscribe = onWalletStateChange((status) => {
      setWalletState({
        connected: status.connected,
        accountId: status.accountId,
        balance: status.balance,
        loading: false,
        error: status.error
      });
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      setWalletState(prev => ({ ...prev, loading: true, error: null }));
      await signIn();
      // Note: Status will be refreshed when user returns from wallet via handleWalletCallback
    } catch (error) {
      console.error('Sign in error:', error);
      setWalletState(prev => ({
        ...prev,
        loading: false,
        error: handleWalletError(error)
      }));
    }
  };

  const handleSignOut = async () => {
    try {
      setWalletState(prev => ({ ...prev, loading: true, error: null }));
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      setWalletState(prev => ({
        ...prev,
        loading: false,
        error: handleWalletError(error)
      }));
    }
  };

  if (walletState.loading) {
    return (
      <div className="near-wallet-connect">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-500 rounded-full animate-spin border-t-white"></div>
          <span className="text-sm text-gray-400">Connecting to NEAR...</span>
        </div>
      </div>
    );
  }

  if (walletState.error) {
    return (
      <div className="near-wallet-connect">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-sm text-red-400">{walletState.error}</span>
          <button 
            onClick={handleSignIn}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors ml-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!walletState.connected) {
    return (
      <div className="near-wallet-connect">
        <button 
          onClick={handleSignIn}
          className="bg-near-green hover:bg-near-green/80 text-black font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#00D2FF' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.71 9 10.93V2zm1 15.93C18.16 16.71 22 12.55 22 7V7L12 2v15.93z"/>
          </svg>
          Connect NEAR Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="near-wallet-connect">
      <div className="flex items-center gap-4">
        {/* Account Info */}
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-sm font-mono text-gray-300">
              {walletState.accountId.length > 20 
                ? `${walletState.accountId.substring(0, 8)}...${walletState.accountId.substring(walletState.accountId.length - 8)}`
                : walletState.accountId
              }
            </span>
            <span className="text-xs text-gray-500">NEAR Account</span>
          </div>
        </div>

        {/* Balance */}
        {walletState.balance && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-mono text-gray-300">
                {walletState.balance.availableNEAR} NEAR
              </span>
              <span className="text-xs text-gray-500">Available Balance</span>
            </div>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs uppercase tracking-wider text-gray-500">
            Connected
          </span>
        </div>

        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut}
          className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 border border-red-400/30 rounded hover:border-red-300/50"
        >
          Sign Out
        </button>
      </div>

      {/* Low Balance Warning */}
      {walletState.balance && parseFloat(walletState.balance.availableNEAR) < 0.1 && (
        <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Low balance - visit{' '}
          <a 
            href="https://wallet.testnet.near.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            NEAR Faucet
          </a>
        </div>
      )}
    </div>
  );
}

// Export wallet state hook for other components
export function useNEARWallet() {
  const [walletState, setWalletState] = useState({
    connected: false,
    accountId: null,
    balance: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function loadWalletStatus() {
      try {
        // Handle wallet callback first (if returning from wallet)
        const isCallback = await handleWalletCallback();
        if (isCallback) {
          console.log('✅ Wallet callback processed successfully');
        }
        
        const status = await getWalletStatus();
        setWalletState({
          connected: status.connected,
          accountId: status.accountId,
          balance: status.balance,
          loading: false,
          error: status.error
        });
      } catch (error) {
        setWalletState(prev => ({
          ...prev,
          loading: false,
          error: handleWalletError(error)
        }));
      }
    }

    loadWalletStatus();

    const unsubscribe = onWalletStateChange((status) => {
      setWalletState({
        connected: status.connected,
        accountId: status.accountId,
        balance: status.balance,
        loading: false,
        error: status.error
      });
    });

    return unsubscribe;
  }, []);

  return walletState;
} 