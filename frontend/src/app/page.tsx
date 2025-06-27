'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import DetectionResults from '@/components/DetectionResults';
import WalletConnection from '@/components/WalletConnection';
import contractABI from "@/utils/DeepfakeDetectorABI.json";
import SplineCanvas from "@/components/SplineCanvas";

interface DetectionResult {
  file_hash: string;
  is_deepfake: boolean;
  confidence: number;
  analysis_reason: string;
  processing_time: number;
  model_version: string;
  timestamp: number;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [totalScans, setTotalScans] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSignIn = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, create a test account ID
    const testAccountId = `user-${Math.random().toString(36).substring(2, 8)}.testnet`;
    setAccountId(testAccountId);
    setIsConnected(true);
    setIsConnecting(false);
    
    console.log('Connected to simulated NEAR account:', testAccountId);
  };

  const handleSignOut = () => {
    setIsConnected(false);
    setAccountId(null);
    setCurrentResult(null);
    setTotalScans(0);
  };

  const handleFileUpload = async (file: File) => {
    if (!isConnected) return;

    setIsAnalyzing(true);
    
    try {
      const fileHash = await generateFileHash(file);
      const detectionResult = await simulateDetection(fileHash, file.name);
      
      setCurrentResult({
        ...detectionResult,
        file_hash: fileHash,
        timestamp: Date.now(),
      });

      setTotalScans(prev => prev + 1);
      
      // Log the analysis for demo purposes
      console.log('File analyzed:', {
        filename: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        hash: fileHash,
        result: detectionResult,
        account: accountId
      });
      
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  };

  const simulateDetection = async (fileHash: string, filename: string) => {
    // Simulate AI processing time (2-4 seconds)
    await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
    
    const hashInt = parseInt(fileHash.substring(0, 8), 16) || 0;
    const isDeepfake = (hashInt % 3) === 0;
    const confidence = 60 + (hashInt % 40);
    
    const reasons = [
      "Facial inconsistencies detected in temporal analysis",
      "Unusual blinking patterns suggest synthetic generation", 
      "Micro-expressions show signs of digital manipulation",
      "Audio-visual synchronization anomalies detected",
      "Neural network artifacts found in facial regions"
    ];

    return {
      is_deepfake: isDeepfake,
      confidence,
      analysis_reason: isDeepfake ? reasons[hashInt % reasons.length] : "No manipulation detected",
      processing_time: 2.5 + (hashInt % 100) / 100,
      model_version: "deepfake-detector-v1.0"
    };
  };

  useEffect(() => {
    async function checkContractConnection() {
      try {
        // Dynamically import ethers only on the client
        const { ethers } = await import("ethers");
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const signer = await provider.getSigner(0);
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const address = contract.target;
        console.log("Connected to DeepfakeDetector contract at:", address);
        const owner = await contract.owner();
        console.log("Contract owner:", owner);
        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);
      } catch (err) {
        console.error("Error connecting to contract:", err);
      }
    }
    checkContractConnection();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* 3D Spline Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <SplineCanvas
          splineUrl="https://prod.spline.design/T13hoFcu40hYf79c/scene.splinecode"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Main Content (z-10) */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-light tracking-wide mb-2">
                DEEPFAKE DETECTION
              </h1>
              <p className="text-gray-400 text-sm uppercase tracking-widest">
                NEAR AI Agent • Autonomous Detection
              </p>
            </div>
            
            <div className="mt-8">
              <WalletConnection
                isConnected={isConnected}
                accountId={accountId}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                isConnecting={isConnecting}
              />
            </div>

            {/* Connection Status */}
            {isConnected && accountId && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-800 bg-green-900/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">
                    Connected to NEAR Testnet
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-2xl font-mono text-white">{totalScans.toString().padStart(3, '0')}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-white">AI</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Shade Agent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-white">0G</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Network</div>
            </div>
          </div>

          {/* NEAR Account Info */}
          {isConnected && accountId && (
            <div className="mb-12 border border-gray-800 p-6">
              <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 mb-4">
                Connected Account
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-xs text-gray-500 block">Account ID</label>
                  <p className="font-mono text-white">{accountId}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Network</label>
                  <p className="font-mono text-white">NEAR Testnet</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Status</label>
                  <p className="font-mono text-green-400">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload & Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Upload Section */}
            <div>
              <h2 className="text-xl font-light mb-8 tracking-wide">Upload Media</h2>
              <FileUpload 
                onFileUpload={handleFileUpload}
                isProcessing={isAnalyzing}
                disabled={!isConnected}
              />
              
              {!isConnected && (
                <div className="mt-6 border border-yellow-800 bg-yellow-900/20 p-4">
                  <p className="text-yellow-400 text-sm">
                    Connect your NEAR wallet to start analyzing files
                  </p>
                  <p className="text-yellow-600 text-xs mt-1">
                    Demo mode - Click "Connect Wallet" to simulate connection
                  </p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div>
              <h2 className="text-xl font-light mb-8 tracking-wide">Analysis Results</h2>
              <DetectionResults 
                result={currentResult}
                isAnalyzing={isAnalyzing}
              />
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24 border-t border-gray-800 pt-16">
            <h2 className="text-xl font-light mb-12 tracking-wide text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">01</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Connect</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Connect your NEAR wallet to authenticate
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">02</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Upload</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Secure upload to 0G decentralized storage
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">03</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Analyze</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  NEAR Shade Agent processes with neural networks
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">04</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Verify</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Immutable results on NEAR blockchain
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center text-gray-500">
              <p className="text-xs uppercase tracking-widest">
                Powered by NEAR Protocol × 0G Network
              </p>
              <p className="text-xs mt-2 font-mono">
                {process.env.NEXT_PUBLIC_AGENT_ACCOUNT || 'deepfake-agent.testnet'}
              </p>
              <div className="mt-4 text-xs space-y-1">
                <p>• Demo NEAR Wallet Integration</p>
                <p>• Simulated Blockchain Connection</p>
                <p>• Real File Analysis Simulation</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
