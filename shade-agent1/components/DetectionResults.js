export default function DetectionResults({ result, isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <div className="text-center space-y-6">
        <div className="w-12 h-12 mx-auto border border-gray-600 rounded-full animate-spin border-t-white"></div>
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Analyzing in TEE</h3>
          <p className="text-xs text-gray-500">
            NEAR Shade Agent processing with enhanced privacy
          </p>
        </div>
        <div className="w-full bg-gray-800 h-1 rounded">
          <div className="bg-gradient-to-r from-white to-gray-400 h-1 rounded animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center space-y-6">
        <div className="text-4xl text-gray-700">○</div>
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">No Analysis</h3>
          <p className="text-xs text-gray-500">Upload a file to see results</p>
        </div>
        
        <div className="border border-gray-800 p-6 text-left">
          <h4 className="text-xs font-medium uppercase tracking-wider mb-4 text-gray-400">Detection Methods</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <p>• TEE-verified processing</p>
            <p>• Facial region analysis</p>
            <p>• Temporal consistency check</p>
            <p>• Neural artifact detection</p>
            <p>• Enhanced feature extraction</p>
          </div>
        </div>
      </div>
    );
  }

  const isDeepfake = result.isDeepfake;
  const confidence = Math.round(result.confidence * 100);
  const statusColor = isDeepfake ? 'text-red-400' : 'text-green-400';

  return (
    <div className="space-y-8">
      {/* Main Result */}
      <div className="text-center border border-gray-800 p-8">
        <div className={`text-6xl font-mono mb-4 ${statusColor}`}>
          {confidence}%
        </div>
        <div className="space-y-2">
          <h3 className={`text-sm font-medium tracking-wider uppercase ${statusColor}`}>
            {isDeepfake ? 'Deepfake Detected' : 'Authentic Content'}
          </h3>
          <p className="text-xs text-gray-500">Confidence Score</p>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="border border-gray-800 p-6 space-y-4">
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
            Analysis
          </label>
          <p className="text-sm text-gray-300">
            {result.features?.detectionFeatures?.nameAnalysis || 'Advanced neural network analysis completed'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block">
              Time
            </label>
            <p className="text-sm font-mono">{(result.processingTime / 1000).toFixed(1)}s</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block">
              Model
            </label>
            <p className="text-sm font-mono">{result.modelVersion}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
            File Hash
          </label>
          <p className="text-xs font-mono text-gray-400 break-all">{result.fileHash}</p>
        </div>
      </div>

      {/* TEE Verification */}
      {result.teeVerified && (
        <div className="border border-green-700 p-4 bg-green-900/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="text-xs uppercase tracking-wider text-green-400">TEE Verified</h4>
          </div>
          <p className="text-xs text-gray-500">
            Processing verified by: {result.teeWorkerAccount?.substring(0, 16)}...
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Attestation: {result.teeAttestation}
          </p>
        </div>
      )}

      {/* Technical Analysis */}
      <div className="border border-gray-800 p-6">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Technical Analysis</h4>
        <div className="space-y-3 text-xs">
          {result.features?.entropy && (
            <div className="flex justify-between">
              <span className="text-gray-400">Entropy</span>
              <span className="text-gray-300">{result.features.entropy}</span>
            </div>
          )}
          {result.features?.faceCount && (
            <div className="flex justify-between">
              <span className="text-gray-400">Face Count</span>
              <span className="text-gray-300">{result.features.faceCount}</span>
            </div>
          )}
          {result.features?.frameAnalysis && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Frames</span>
                <span className="text-gray-300">{result.features.frameAnalysis.totalFrames}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Suspicious Frames</span>
                <span className={result.features.frameAnalysis.suspiciousFrames > 0 ? 'text-red-400' : 'text-green-400'}>
                  {result.features.frameAnalysis.suspiciousFrames}
                </span>
              </div>
              {result.features.frameAnalysis.consistencyScore && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Consistency Score</span>
                  <span className="text-gray-300">{result.features.frameAnalysis.consistencyScore}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="border border-gray-700 p-4 bg-gray-900/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h4 className="text-xs uppercase tracking-wider text-blue-400">Blockchain Ready</h4>
        </div>
        <p className="text-xs text-gray-500">
          Results ready for NEAR blockchain storage
        </p>
        <p className="text-xs text-gray-600 mt-1 font-mono">
          {result.timestamp}
        </p>
      </div>
    </div>
  );
} 