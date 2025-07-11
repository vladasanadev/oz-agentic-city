import Head from 'next/head';
import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import DetectionResults from '../components/DetectionResults';
import WalletConnection from '../components/WalletConnection';
import SplineCanvas from '../components/SplineCanvas';

export default function Home() {
    const [accountId, setAccountId] = useState();
    const [balance, setBalance] = useState('0');
    const [teeVerified, setTeeVerified] = useState(false);
    const [teeEndpoint, setTeeEndpoint] = useState('');
    const [source, setSource] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [totalScans, setTotalScans] = useState(0);

    const getWorkerDetails = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/getWorkerAccount').then((r) => r.json());
            if (res.error) {
                console.log('Error getting worker account:', res.error);
                setError('Failed to get worker account details');
                return;
            }
            setAccountId(res.accountId);
            setBalance(res.balance);
            setTeeVerified(res.teeVerified);
            setTeeEndpoint(res.teeEndpoint);
            setSource(res.source);
        } catch (error) {
            console.log('Error fetching worker details:', error);
            setError('Failed to fetch worker account details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getWorkerDetails();
        const interval = setInterval(getWorkerDetails, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const handleFileUpload = (file) => {
        const maxSize = 50 * 1024 * 1024; // 50MB
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/mov', 'video/avi', 'video/webm'];
        
        if (file.size > maxSize) {
            setError('File size must be less than 50MB');
            return;
        }
        
        if (!supportedTypes.includes(file.type)) {
            setError('Unsupported file type. Please upload images (JPG, PNG) or videos (MP4, MOV, AVI, WebM)');
            return;
        }
        
        setSelectedFile(file);
        setError('');
        setDetectionResult(null);
    };

    const detectDeepfake = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setIsProcessing(true);
        setError('');
        
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            console.log('🚀 Submitting to Shade Agent for TEE processing...');
            
            const response = await fetch('/api/detectDeepfake', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                setDetectionResult(data.result);
                setTotalScans(prev => prev + 1);
                console.log('✅ Detection completed:', data.result);
            } else {
                throw new Error(data.error || 'Detection failed');
            }
        } catch (error) {
            console.error('❌ Detection failed:', error);
            setError('Detection failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const resetDetection = () => {
        setSelectedFile(null);
        setDetectionResult(null);
        setError('');
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <Head>
                <title>Deepfake Detection Agent</title>
                <meta name="description" content="AI-powered deepfake detection using NEAR Shade Agents" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                                NEAR Shade Agent • TEE-Verified Processing
                            </p>
                        </div>
                        
                        <div className="mt-8">
                            <WalletConnection
                                accountId={accountId}
                                balance={balance}
                                teeVerified={teeVerified}
                                teeEndpoint={teeEndpoint}
                                source={source}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Connection Status */}
                        {accountId && (
                            <div className="mt-4 text-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-800 bg-green-900/20">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-400 font-mono">
                                        {teeVerified ? 'TEE Verified' : 'Fallback Mode'}
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
                            <div className="text-2xl font-mono text-white">TEE</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Shade Agent</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-mono text-white">AI</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Detection</div>
                        </div>
                    </div>

                    {/* Worker Account Info */}
                    {accountId && (
                        <div className="mb-12 border border-gray-800 p-6">
                            <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 mb-4">
                                Worker Account Status
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <label className="text-xs text-gray-500 block">Account ID</label>
                                    <p className="font-mono text-white">{accountId}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">Balance</label>
                                    <p className="font-mono text-white">{balance} NEAR</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 block">Status</label>
                                    <p className={`font-mono ${teeVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {teeVerified ? 'TEE Verified' : 'Fallback Mode'}
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
                                disabled={!accountId}
                                selectedFile={selectedFile}
                                onRemoveFile={resetDetection}
                            />
                            
                            {!accountId && !isLoading && (
                                <div className="mt-6 border border-yellow-800 bg-yellow-900/20 p-4">
                                    <p className="text-yellow-400 text-sm">
                                        TEE worker account connection required
                                    </p>
                                    <p className="text-yellow-600 text-xs mt-1">
                                        Please wait while connecting to Shade Agent...
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="mt-6 border border-red-800 bg-red-900/20 p-4">
                                    <p className="text-red-400 text-sm">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Detection Button */}
                            {selectedFile && (
                                <div className="mt-6">
                                    <button 
                                        onClick={detectDeepfake}
                                        disabled={!selectedFile || isProcessing}
                                        className={`
                                            w-full px-8 py-4 border text-sm uppercase tracking-wider transition-colors
                                            ${isProcessing 
                                                ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                                                : 'border-gray-700 hover:border-gray-500 hover:bg-gray-900'
                                            }
                                        `}
                                    >
                                        {isProcessing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border border-gray-500 rounded-full animate-spin border-t-white"></div>
                                                Processing in TEE...
                                            </div>
                                        ) : (
                                            'Detect Deepfake'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results Section */}
                        <div>
                            <h2 className="text-xl font-light mb-8 tracking-wide">Analysis Results</h2>
                            <DetectionResults 
                                result={detectionResult}
                                isAnalyzing={isProcessing}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
