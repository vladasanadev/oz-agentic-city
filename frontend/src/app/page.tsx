'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';

import WalletConnection from '@/components/WalletConnection';
import SplineCanvas from "@/components/SplineCanvas";

// Aurora Testnet Configuration
const AURORA_TESTNET = {
  chainId: '0x4E454153', // 1313161555 in hex
  chainName: 'Aurora Testnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.aurora.dev'],
  blockExplorerUrls: ['https://testnet.aurorascan.dev'],
};

// Contract configuration
const CONTRACT_ADDRESS = "0x852a4844269a9329B24ecb09a7AbE4c6Fb70481d";
const CONTRACT_ABI = [
  "function requestDetectionWithResult(string fileHash, string filename) public",
  "function getResult(string fileHash) public view returns (tuple(string fileHash, string filename, bool isDeepfake, uint8 confidence, uint256 timestamp, address agent, string agentId))",
  "function getTotalScans() public view returns (uint256)",
  "function hasResult(string fileHash) public view returns (bool)",
  "event DetectionRequested(string indexed fileHash, string filename, address requester)",
  "event DetectionStored(string indexed fileHash, bool isDeepfake, uint8 confidence, address agent, string agentId)"
];

interface DetectionResult {
  fileHash: string;
  filename: string;
  isDeepfake: boolean;
  confidence: number;
  timestamp: number;
  agent: string;
  agentId: string;
}





export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<any>(null);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await initializeContract();
      }
    }
  };

  const handleSignIn = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      // Check if Aurora testnet is added
      await addAuroraNetwork();
      
      setAccount(accounts[0]);
      setIsConnected(true);
      await initializeContract();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const addAuroraNetwork = async () => {
    try {
      await window.ethereum!.request({
        method: 'wallet_addEthereumChain',
        params: [AURORA_TESTNET],
      });
    } catch (error) {
      console.error('Error adding Aurora network:', error);
    }
  };

  const initializeContract = async () => {
    if (!CONTRACT_ADDRESS) {
      console.log('Contract address not set yet');
      return;
    }

    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      //@ts-expect-error
      setContract(contractInstance);
      
      // Get total scans
      const scans = await contractInstance.getTotalScans();
      setTotalScans(Number(scans));
      
      console.log('Contract initialized successfully');
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const handleSignOut = () => {
    setIsConnected(false);
    setAccount('');
    setContract(null);
    setResult(null);
    setTotalScans(0);
  };

  const handleFileUpload = async (file: File) => {
    if (!contract) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // Generate file hash
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const fileHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log(`📁 File uploaded: ${file.name}`);
      console.log(`🔗 File hash: ${fileHash}`);

      // Request detection
      let tx;
      try {
        tx = await contract.requestDetectionWithResult(fileHash, file.name);
      } catch (error) {
        console.log("New function failed, trying old function...", );
        tx = await contract.requestDetection(fileHash, file.name);
      }
      console.log(`📝 Detection request sent: ${tx.hash}`);
      
      await tx.wait();
      console.log('✅ Transaction confirmed, getting result...');

      // Get result immediately
      await getImmediateResult(fileHash);

    } catch (error) {
      console.error('Detection request failed:', error);
      setIsProcessing(false);
    }
  };

  const getImmediateResult = async (fileHash: string) => {
    try {
      // Check if result exists
      const hasResult = await contract!.hasResult(fileHash);
      
      if (hasResult) {
        const result = await contract!.getResult(fileHash);
        
        const detectionResult: DetectionResult = {
          fileHash: result.fileHash,
          filename: result.filename,
          isDeepfake: result.isDeepfake,
          confidence: result.confidence,
          timestamp: Number(result.timestamp),
          agent: result.agent,
          agentId: result.agentId,
        };

        setResult(detectionResult);
        setIsProcessing(false);
        
        // Update total scans
        const scans = await contract!.getTotalScans();
        setTotalScans(Number(scans));
        
        console.log('🎉 Detection completed:', detectionResult);
      } else {
        setIsProcessing(false);
        alert('No result found. Please try again.');
      }
    } catch (error) {
      console.error('Error getting result:', error);
      setIsProcessing(false);
      alert('Error getting detection result. Please try again.');
    }
  };

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
                AURORA AI DEEPFAKE DETECTOR
              </h1>
              <p className="text-gray-400 text-sm uppercase tracking-widest">
                Autonomous AI agents on NEAR's Aurora network
              </p>
            </div>
            
            <div className="mt-8">
              <WalletConnection
                isConnected={isConnected}
                accountId={account ? `${account.substring(0, 6)}...${account.substring(38)}` : null}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                isConnecting={isConnecting}
              />
            </div>

            {/* Connection Status */}
            {isConnected && account && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-800 bg-green-900/20">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-mono">
                    Connected to Aurora Testnet
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
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total AI Scans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-white">
                {contract ? '🟢 Online' : '🔴 Offline'}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Agent Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono text-white">Aurora</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">NEAR EVM</div>
            </div>
          </div>

          {/* Aurora Account Info */}
          {isConnected && account && (
            <div className="mb-12 border border-gray-800 p-6">
              <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 mb-4">
                Connected Wallet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-xs text-gray-500 block">Ethereum Address</label>
                  <p className="font-mono text-white">{account.substring(0, 10)}...{account.substring(32)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Network</label>
                  <p className="font-mono text-white">Aurora Testnet</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Status</label>
                  <p className="font-mono text-green-400">
                    {contract ? 'Contract Connected' : 'Contract Loading...'}
                  </p>
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
                isProcessing={isProcessing}
                disabled={!isConnected}
              />
              
              {!isConnected && (
                <div className="mt-6 border border-yellow-800 bg-yellow-900/20 p-4">
                  <p className="text-yellow-400 text-sm">
                    Connect your MetaMask wallet to start analyzing files
                  </p>
                  <p className="text-yellow-600 text-xs mt-1">
                    Aurora testnet required - network will be added automatically
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="mt-6 border border-blue-800 bg-blue-900/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-blue-400 text-sm font-medium">🤖 Autonomous Agent Processing</p>
                      <p className="text-blue-600 text-xs mt-1">AI agent is analyzing your file on Aurora...</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-600 space-y-1">
                    <p>✅ File uploaded</p>
                    <p>✅ Detection requested on Aurora</p>
                    <p>⏳ Waiting for agent response...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div>
              <h2 className="text-xl font-light mb-8 tracking-wide">Analysis Results</h2>
              
              {result && (
                <div className={`border p-6 ${result.isDeepfake ? 'border-red-800 bg-red-900/20' : 'border-green-800 bg-green-900/20'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      {result.isDeepfake ? '⚠️ Deepfake Detected' : '✅ Authentic Content'}
                    </h3>
                    <div className={`px-3 py-1 text-xs font-mono rounded ${result.isDeepfake ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'}`}>
                      {result.confidence}% confidence
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block">Filename</label>
                        <p className="font-mono text-white">{result.filename}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">Agent ID</label>
                        <p className="font-mono text-white">{result.agentId}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 block">Processed</label>
                        <p className="font-mono text-white">
                          {new Date(result.timestamp * 1000).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block">Agent Address</label>
                        <p className="font-mono text-white">
                          {result.agent.substring(0, 10)}...{result.agent.substring(32)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">🔗 <strong>Blockchain Verified</strong></p>
                    <p className="text-xs text-gray-500">This result is cryptographically stored on Aurora</p>
                  </div>
                </div>
              )}

              {!result && !isProcessing && (
                <div className="border border-gray-800 p-6 text-center">
                  <p className="text-gray-500 text-sm">No analysis results yet</p>
                  <p className="text-gray-600 text-xs mt-1">Upload a file to start detection</p>
                </div>
              )}
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
                  Connect MetaMask to Aurora testnet
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">02</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Upload</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Secure file upload and hash generation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">03</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Analyze</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Autonomous AI agent processes with neural networks
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border border-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">04</span>
                </div>
                <h3 className="text-sm font-medium mb-2">Verify</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Immutable results on Aurora blockchain
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
                Built on Aurora (NEAR's EVM) • Autonomous AI Agents
              </p>
              <p className="text-xs mt-2 font-mono">
                Contract: {CONTRACT_ADDRESS.substring(0, 10)}...{CONTRACT_ADDRESS.substring(32)}
              </p>
              <div className="mt-4 text-xs space-y-1">
                <p>• Real Aurora Testnet Integration</p>
                <p>• Smart Contract Verification</p>
                <p>• Autonomous Agent Processing</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
