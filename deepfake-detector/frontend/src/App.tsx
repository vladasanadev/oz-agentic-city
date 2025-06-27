import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

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

// Contract configuration (update after deployment)
const CONTRACT_ADDRESS = "0x61a7a20fc63a5E228771955D86aCC291C068F00A"; // Update with deployed contract address
const CONTRACT_ABI = [
  "function requestDetection(string fileHash, string filename) public",
  "function getResult(string fileHash) public view returns (tuple(string fileHash, string filename, bool isDeepfake, uint8 confidence, uint256 timestamp, address agent, string agentId))",
  "function getTotalScans() public view returns (uint256)",
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

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

function App() {
  const [account, setAccount] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        await initializeContract();
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check if Aurora testnet is added
      await addAuroraNetwork();
      
      setAccount(accounts[0]);
      setIsConnected(true);
      await initializeContract();
    } catch (error) {
      console.error('Error connecting wallet:', error);
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
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      setContract(contractInstance);
      
      // Get total scans
      const scans = await contractInstance.getTotalScans();
      setTotalScans(Number(scans));
    } catch (error) {
      console.error('Error initializing contract:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !contract) return;

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

      // Request detection from autonomous agent
      const tx = await contract.requestDetection(fileHash, file.name);
      console.log(`📝 Detection request sent: ${tx.hash}`);
      
      await tx.wait();
      console.log('✅ Transaction confirmed, waiting for agent...');

      // Poll for result from autonomous agent
      await pollForResult(fileHash);

    } catch (error) {
      console.error('Detection request failed:', error);
      setIsProcessing(false);
    }
  };

  const pollForResult = async (fileHash: string) => {
    const maxAttempts = 30; // 1 minute max wait
    let attempts = 0;

    const poll = async () => {
      try {
        const result = await contract!.getResult(fileHash);
        
        if (result.fileHash !== '') {
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
          return;
        }
      } catch (error) {
        console.log('Polling for result...', attempts + 1);
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000); // Poll every 2 seconds
      } else {
        setIsProcessing(false);
        alert('Timeout waiting for detection result. Please try again.');
      }
    };

    poll();
  };

  return (
    <div className="App">
      <div className="aurora-bg">
        <header className="app-header">
          <h1>🔍 Aurora AI Deepfake Detector</h1>
          <p className="subtitle">Autonomous AI agents on NEAR's Aurora network</p>
          
          {account ? (
            <div className="wallet-info">
              <span className="connected-indicator">🟢</span>
              <span className="account">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
              <span className="network">Aurora Testnet</span>
            </div>
          ) : (
            <button className="connect-button" onClick={connectWallet}>
              Connect MetaMask
            </button>
          )}
        </header>

        <main className="main-content">
          <div className="stats-card">
            <h3>📊 Network Stats</h3>
            <div className="stat">
              <span className="stat-label">Total AI Scans:</span>
              <span className="stat-value">{totalScans}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Network:</span>
              <span className="stat-value">Aurora (NEAR EVM)</span>
            </div>
            <div className="stat">
              <span className="stat-label">Status:</span>
              <span className="stat-value">
                {contract ? '🟢 Agent Online' : '🔴 Contract Not Set'}
              </span>
            </div>
          </div>

          {account && (
            <div className="upload-section">
              <div 
                className="upload-area"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <div className="upload-icon">📁</div>
                <h3>Upload File for AI Detection</h3>
                <p>Autonomous agents will analyze your content</p>
                <p className="file-types">Supports: JPG, PNG, MP4, GIF</p>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {isProcessing && (
                <div className="processing-card">
                  <div className="spinner"></div>
                  <h3>🤖 Autonomous Agent Processing</h3>
                  <p>AI agent is analyzing your file...</p>
                  <p className="processing-steps">
                    ✅ File uploaded<br/>
                    ✅ Detection requested on Aurora<br/>
                    ⏳ Waiting for agent response...
                  </p>
                </div>
              )}

              {result && (
                <div className={`result-card ${result.isDeepfake ? 'deepfake' : 'authentic'}`}>
                  <div className="result-header">
                    <h3>
                      {result.isDeepfake ? '⚠️ Deepfake Detected' : '✅ Authentic Content'}
                    </h3>
                    <div className="confidence-badge">
                      {result.confidence}% confidence
                    </div>
                  </div>
                  
                  <div className="result-details">
                    <div className="detail">
                      <span className="label">Filename:</span>
                      <span className="value">{result.filename}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Agent ID:</span>
                      <span className="value">{result.agentId}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Processed:</span>
                      <span className="value">
                        {new Date(result.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Agent Address:</span>
                      <span className="value">
                        {result.agent.substring(0, 10)}...{result.agent.substring(32)}
                      </span>
                    </div>
                  </div>

                  <div className="blockchain-proof">
                    <p>🔗 <strong>Blockchain Verified</strong></p>
                    <p>This result is cryptographically stored on Aurora</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!account && (
            <div className="connect-prompt">
              <h2>🚀 Connect to Get Started</h2>
              <p>Connect your MetaMask wallet to experience autonomous AI detection on Aurora</p>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Built on Aurora (NEAR's EVM) • Autonomous AI Agents • Hackathon Demo</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
