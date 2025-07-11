import { useState } from 'react';
import NEARSocialShare from './NEARSocialShare';

export default function DetectionResults({ result, isAnalyzing }) {
    const [showDetails, setShowDetails] = useState(false);

    if (isAnalyzing) {
        return (
            <div className="border border-gray-800 bg-gray-900/20 p-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border border-gray-600 rounded-full animate-spin border-t-white"></div>
                    <p className="text-gray-400 text-sm mb-2">Analyzing content...</p>
                    <p className="text-gray-600 text-xs">Processing through TEE environment</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="border border-gray-800 bg-gray-900/20 p-8">
                <div className="text-center text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 border border-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <p className="text-sm">Upload media to analyze</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Main Result */}
            <div className="border border-gray-800 bg-gray-900/20 p-6">
                <div className="text-center mb-6">
                    <div className={`text-6xl mb-4 ${result.isDeepfake ? 'text-red-400' : 'text-green-400'}`}>
                        {result.isDeepfake ? '⚠️' : '✅'}
                    </div>
                    <h3 className={`text-2xl font-light mb-2 ${result.isDeepfake ? 'text-red-400' : 'text-green-400'}`}>
                        {result.isDeepfake ? 'Deepfake Detected' : 'Authentic Content'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                        <div className="text-lg font-mono text-white">{Math.round(result.confidence * 100)}%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Confidence</div>
                    </div>
                    <div className="text-center">
                        <div className={`text-lg font-mono ${result.teeVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                            {result.teeVerified ? 'TEE' : 'TEE'}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Processing</div>
                        <div className={`text-xs ${result.teeVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                            {result.teeVerified ? 'Verified' : 'Fallback'}
                        </div>
                    </div>
                </div>

                {/* Details Toggle */}
                <div className="text-center">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>

                {/* Detailed Results */}
                {showDetails && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Model Version</label>
                                <p className="font-mono text-white">{result.modelVersion || 'v1.0'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Processing Time</label>
                                <p className="font-mono text-white">{result.processingTime || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">TEE Environment</label>
                                <p className={`font-mono ${result.teeVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {result.teeVerified ? 'Verified' : 'Fallback Mode'}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Timestamp</label>
                                <p className="font-mono text-white">{new Date().toLocaleString()}</p>
                            </div>
                            
                            {/* NEAR Wallet Integration Status */}
                            {result.nearWallet && (
                                <>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">NEAR Account</label>
                                        <p className={`font-mono text-sm ${result.nearWallet.connected ? 'text-green-400' : 'text-gray-400'}`}>
                                            {result.nearWallet.connected ? result.nearWallet.accountId : 'Not connected'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">NEAR Balance</label>
                                        <p className={`font-mono text-sm ${result.nearWallet.connected ? 'text-green-400' : 'text-gray-400'}`}>
                                            {result.nearWallet.connected ? `${result.nearWallet.balance} NEAR` : 'N/A'}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* NEAR Social Share Component */}
            <NEARSocialShare result={result} />
        </div>
    );
} 