export default function WalletConnection({ 
  accountId, 
  balance, 
  teeVerified, 
  teeEndpoint,
  source,
  isLoading = false
}) {
  const formatBalance = (balance) => {
    if (typeof balance === 'string') {
      return balance;
    }
    return balance ? parseFloat(balance).toFixed(4) : '0.0000';
  };

  return (
    <div className="flex items-center justify-center">
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-gray-500 rounded-full animate-spin border-t-white"></div>
          <span className="text-sm text-gray-400">Connecting to TEE...</span>
        </div>
      ) : accountId ? (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${teeVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-mono text-gray-300">
              {accountId.substring(0, 16)}...
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {formatBalance(balance)} NEAR
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${teeVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs uppercase tracking-wider text-gray-500">
              {teeVerified ? 'TEE Verified' : 'Fallback Mode'}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">
          No worker account connected
        </div>
      )}
    </div>
  );
} 