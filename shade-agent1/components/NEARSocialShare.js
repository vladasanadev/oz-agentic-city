import { useState } from 'react';
import { shareDetectionResult } from '../utils/near-social';
import { useNEARWallet } from './NEARWalletConnect';

export default function NEARSocialShare({ result }) {
  const [isSharing, setIsSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const nearWallet = useNEARWallet();

  // Generate default message based on result
  const defaultMessage = result?.isDeepfake 
    ? `🚨 Deepfake detected with ${Math.round(result.confidence * 100)}% confidence using NEAR Shade Agent TEE processing`
    : `✅ Authentic content verified with ${Math.round(result.confidence * 100)}% confidence using NEAR Shade Agent TEE processing`;

  const handleShare = async () => {
    if (!nearWallet.connected) {
      alert('Please connect your NEAR wallet to share results');
      return;
    }

    if (!result) {
      alert('No detection result to share');
      return;
    }

    setIsSharing(true);
    setShareResult(null);

    try {
      const messageToShare = customMessage.trim() || defaultMessage;
      
      console.log('📱 Sharing result on NEAR Social...', {
        isDeepfake: result.isDeepfake,
        confidence: result.confidence,
        message: messageToShare
      });

      const shareResponse = await shareDetectionResult(result, messageToShare);
      
      if (shareResponse.success) {
        setShared(true);
        setShareResult(shareResponse);
        console.log('✅ Successfully shared on NEAR Social:', shareResponse);
      } else {
        throw new Error(shareResponse.error || 'Failed to share');
      }
    } catch (error) {
      console.error('❌ Sharing failed:', error);
      
      // Check if it's a contract availability issue
      let errorMessage = error.message;
      if (error.message.includes('not available') || error.message.includes('does not exist')) {
        errorMessage = 'NEAR Social not available on testnet. Try on mainnet for full social features.';
      }
      
      setShareResult({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsSharing(false);
    }
  };

  const resetShare = () => {
    setShared(false);
    setShareResult(null);
    setCustomMessage('');
    setShowCustomMessage(false);
  };

  if (!result) {
    return (
      <div className="near-social-share text-center py-4">
        <p className="text-gray-500 text-sm">Complete a detection to share results</p>
      </div>
    );
  }

  if (shared && shareResult?.success) {
    return (
      <div className="near-social-share">
        <div className="border border-green-700 bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-green-400">Shared on NEAR Social</h4>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">
            {shareResult.mockMode 
              ? 'Your detection result has been saved to test data (mock mode)!'
              : shareResult.realBlockchain
              ? 'Your detection result has been posted to NEAR Social testnet blockchain!'
              : 'Your detection result has been shared with the community!'
            }
          </p>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction:</span>
              <span className="text-green-400 font-mono">
                {shareResult.transactionHash?.substring(0, 16)}...
              </span>
            </div>
            {shareResult.testnetExplorer ? (
              <div className="flex justify-between">
                <span className="text-gray-400">Testnet Transaction:</span>
                <a 
                  href={shareResult.testnetExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View on Explorer
                </a>
              </div>
            ) : shareResult.socialUrl ? (
              <div className="flex justify-between">
                <span className="text-gray-400">Social Post:</span>
                <a 
                  href={shareResult.socialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View on NEAR Social
                </a>
              </div>
            ) : shareResult.mockMode ? (
              <div className="flex justify-between">
                <span className="text-gray-400">Mode:</span>
                <span className="text-yellow-400">Test Data (Mock)</span>
              </div>
            ) : null}
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={resetShare}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              Share Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="near-social-share">
      <div className="border border-gray-700 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
          </svg>
          <h4 className="text-sm font-medium text-gray-300">Share on NEAR Social</h4>
        </div>

        {!nearWallet.connected && (
          <div className="mb-4 p-3 border border-yellow-700 bg-yellow-900/20 rounded">
            <p className="text-yellow-400 text-sm">
              Connect your NEAR wallet to share results with the community
            </p>
          </div>
        )}

        {shareResult?.error && (
          <div className="mb-4 p-3 border border-red-700 bg-red-900/20 rounded">
            <p className="text-red-400 text-sm">
              Error: {shareResult.error}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {/* Preview of default message */}
          <div className="bg-gray-800 p-3 rounded text-sm">
            <p className="text-gray-400 text-xs mb-1">Preview:</p>
            <p className="text-gray-300">
              {customMessage.trim() || defaultMessage}
            </p>
          </div>

          {/* Custom message toggle */}
          <div>
            <button
              onClick={() => setShowCustomMessage(!showCustomMessage)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <svg className={`w-3 h-3 transition-transform ${showCustomMessage ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
              {showCustomMessage ? 'Hide' : 'Add'} custom message
            </button>
            
            {showCustomMessage && (
              <div className="mt-2">
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add your own message about this detection..."
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-gray-300 placeholder-gray-500 resize-none"
                  rows={3}
                  maxLength={280}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {customMessage.length}/280 characters
                </p>
              </div>
            )}
          </div>

          {/* Detection summary */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Result:</span>
              <span className={result.isDeepfake ? 'text-red-400' : 'text-green-400'}>
                {result.isDeepfake ? 'Deepfake' : 'Authentic'} ({Math.round(result.confidence * 100)}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span>TEE Verified:</span>
              <span className={result.teeVerified ? 'text-green-400' : 'text-yellow-400'}>
                {result.teeVerified ? 'Yes' : 'Fallback'}
              </span>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            disabled={!nearWallet.connected || isSharing}
            className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              !nearWallet.connected || isSharing
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSharing ? (
              <>
                <div className="w-4 h-4 border border-gray-300 rounded-full animate-spin border-t-transparent"></div>
                Sharing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                </svg>
                Share on NEAR Social
              </>
            )}
          </button>

          {nearWallet.connected && (
            <p className="text-xs text-gray-500 text-center">
              Posting requires ~0.1 NEAR for storage deposit
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 