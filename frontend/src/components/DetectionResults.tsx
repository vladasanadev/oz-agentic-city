interface DetectionResult {
  file_hash: string;
  is_deepfake: boolean;
  confidence: number;
  analysis_reason: string;
  processing_time: number;
  model_version: string;
  timestamp: number;
}

interface DetectionResultsProps {
  result: DetectionResult | null;
  isAnalyzing: boolean;
}

export default function DetectionResults({ result, isAnalyzing }: DetectionResultsProps) {
  if (isAnalyzing) {
    return (
      <div className="text-center space-y-6">
        <div className="w-12 h-12 mx-auto border border-gray-600 rounded-full animate-spin border-t-white"></div>
        <div>
          <h3 className="text-sm font-medium tracking-wide mb-2">Analyzing</h3>
          <p className="text-xs text-gray-500">
            NEAR Shade Agent processing with neural networks
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
            <p>• Facial region analysis</p>
            <p>• Temporal consistency check</p>
            <p>• Neural artifact detection</p>
            <p>• Micro-expression validation</p>
            <p>• Audio-visual synchronization</p>
          </div>
        </div>
      </div>
    );
  }

  const isDeepfake = result.is_deepfake;
  const statusColor = isDeepfake ? 'text-red-400' : 'text-green-400';

  return (
    <div className="space-y-8">
      {/* Main Result */}
      <div className="text-center border border-gray-800 p-8">
        <div className={`text-6xl font-mono mb-4 ${statusColor}`}>
          {result.confidence}%
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
          <p className="text-sm text-gray-300">{result.analysis_reason}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block">
              Time
            </label>
            <p className="text-sm font-mono">{result.processing_time}s</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-gray-500 block">
              Model
            </label>
            <p className="text-sm font-mono">{result.model_version}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2">
            File Hash
          </label>
          <p className="text-xs font-mono text-gray-400 break-all">{result.file_hash}</p>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="border border-gray-800 p-6">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Technical Analysis</h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Facial Region</span>
            <span className={isDeepfake ? 'text-red-400' : 'text-green-400'}>
              {isDeepfake ? 'SUSPICIOUS' : 'NORMAL'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Temporal Check</span>
            <span className={isDeepfake ? 'text-red-400' : 'text-green-400'}>
              {isDeepfake ? 'FAILED' : 'PASSED'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Neural Artifacts</span>
            <span className={isDeepfake ? 'text-red-400' : 'text-green-400'}>
              {isDeepfake ? 'DETECTED' : 'CLEAR'}
            </span>
          </div>
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="border border-gray-700 p-4 bg-gray-900/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h4 className="text-xs uppercase tracking-wider text-blue-400">Blockchain Verified</h4>
        </div>
        <p className="text-xs text-gray-500">
          Results stored on NEAR blockchain
        </p>
        <p className="text-xs text-gray-600 mt-1 font-mono">
          {new Date(result.timestamp).toISOString()}
        </p>
      </div>
    </div>
  );
} 