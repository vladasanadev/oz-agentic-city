interface WalletConnectionProps {
  isConnected: boolean;
  accountId: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isConnecting?: boolean;
}

export default function WalletConnection({ 
  isConnected, 
  accountId, 
  onSignIn, 
  onSignOut,
  isConnecting = false
}: WalletConnectionProps) {
  return (
    <div className="flex items-center justify-center">
      {isConnected ? (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-mono text-gray-300">{accountId}</span>
          </div>
          <button
            onClick={onSignOut}
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-colors border-b border-transparent hover:border-gray-600 pb-1"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onSignIn}
          disabled={isConnecting}
          className={`
            px-8 py-3 border text-sm uppercase tracking-wider transition-colors
            ${isConnecting 
              ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
              : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900'
            }
          `}
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-gray-500 rounded-full animate-spin border-t-white"></div>
              Connecting...
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>
      )}
    </div>
  );
} 