import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import CommunityFeed from '../components/CommunityFeed';
import NEARWalletConnect, { useNEARWallet } from '../components/NEARWalletConnect';

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed');
  const nearWallet = useNEARWallet();

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Community Feed - NEAR Shade Agent</title>
        <meta name="description" content="Community shared deepfake detection results on NEAR Social" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-light">NEAR Shade Agent</h1>
                    <p className="text-xs text-gray-400">← Back to Detection</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <NEARWalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-light mb-2">Community Detection Feed</h1>
          <p className="text-gray-400">
            Community-shared deepfake detection results powered by NEAR Social
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'feed'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Community Feed
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'about'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Content */}
                 {activeTab === 'feed' ? (
           <div>
             {/* Testnet Info */}
             <div className="mb-8 border border-blue-700 bg-blue-900/20 p-6 rounded-lg">
               <div className="flex items-center gap-3 mb-3">
                 <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                 </svg>
                 <h3 className="text-lg font-medium text-blue-400">NEAR Social Testnet</h3>
               </div>
               <p className="text-blue-300 mb-4">
                 This app connects to <strong>v1.social08.testnet</strong> for testing. Posts here won't appear on the main near.social website (which uses mainnet).
               </p>
               <p className="text-blue-600 text-sm">
                 Successful testnet posts can be verified on NEAR Explorer. This is perfect for testing all social features safely.
               </p>
             </div>

             {/* NEAR Wallet Status */}
             {!nearWallet.connected && (
              <div className="mb-8 border border-yellow-700 bg-yellow-900/20 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <h3 className="text-lg font-medium text-yellow-400">NEAR Wallet Required</h3>
                </div>
                <p className="text-yellow-300 mb-4">
                  Connect your NEAR wallet to interact with community posts (like, comment) and share your own detection results.
                </p>
                <p className="text-yellow-600 text-sm">
                  You can still view the community feed without connecting your wallet.
                </p>
              </div>
            )}

            {/* Community Feed */}
            <CommunityFeed />
          </div>
        ) : (
          <div className="space-y-8">
            {/* About Section */}
            <div className="border border-gray-800 bg-gray-900/20 p-8 rounded-lg">
              <h2 className="text-xl font-light mb-4">About Community Detection Feed</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  The Community Detection Feed is powered by <strong>NEAR Social</strong>, a decentralized social network 
                  built on the NEAR blockchain. Users can share their deepfake detection results with the community, 
                  building a transparent and verifiable database of AI-detected content.
                </p>
                <p>
                  All detection results are processed using <strong>TEE (Trusted Execution Environment)</strong> technology 
                  through Shade Agents, ensuring privacy and security while maintaining verifiability.
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="border border-gray-800 bg-gray-900/20 p-8 rounded-lg">
              <h2 className="text-xl font-light mb-4">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                  <div>
                    <h3 className="font-medium mb-2">Detect Content</h3>
                    <p className="text-gray-400 text-sm">
                      Upload and analyze media using our TEE-verified deepfake detection system.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                  <div>
                    <h3 className="font-medium mb-2">Share Results</h3>
                    <p className="text-gray-400 text-sm">
                      Optionally share your detection results with the community via NEAR Social.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                  <div>
                    <h3 className="font-medium mb-2">Build Community</h3>
                    <p className="text-gray-400 text-sm">
                      View, like, and interact with detection results from other community members.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border border-gray-800 bg-gray-900/20 p-8 rounded-lg">
              <h2 className="text-xl font-light mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">TEE-Verified Processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">NEAR Social Integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Community Statistics</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Real-time Feed Updates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Filtering & Search</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Privacy-First Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="border border-gray-800 bg-gray-900/20 p-8 rounded-lg">
              <h2 className="text-xl font-light mb-4">Privacy & Security</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Privacy Protection:</strong> Only detection results and confidence scores are shared. 
                  Original media files never leave your device and are processed securely in TEE environments.
                </p>
                <p>
                  <strong>Blockchain Verification:</strong> All shared detection results are stored on NEAR blockchain 
                  via NEAR Social, providing immutable proof of detection authenticity.
                </p>
                <p>
                  <strong>Opt-in Sharing:</strong> Sharing detection results is completely optional. 
                  You can use the detection service without participating in the community feed.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Start Detecting Content
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 