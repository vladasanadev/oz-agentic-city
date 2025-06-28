import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';
import Overlay from '../components/Overlay';
import Spline from '@splinetool/react-spline';

const contractId = process.env.NEXT_PUBLIC_contractId;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
    const [message, setMessage] = useState('');
    const [accountId, setAccountId] = useState();
    const [balance, setBalance] = useState('0');
    const [selectedFile, setSelectedFile] = useState(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);

    const setMessageHide = async (message, dur = 3000, success = false) => {
        setMessage({ text: message, success });
        await sleep(dur);
        setMessage('');
    };

    const getWorkerDetails = async () => {
        try {
            const res = await fetch('/api/getWorkerAccount').then((r) => r.json());
            if (res.error) {
                console.log('Error getting worker account:', res.error);
                setError('Failed to get worker account details');
                return;
            }
            setAccountId(res.accountId);
            // Convert balance from yoctoNEAR to NEAR
            const formattedBalance = (parseFloat(res.balance) / 1e24).toFixed(4);
            setBalance(formattedBalance);
        } catch (error) {
            console.log('Error fetching worker details:', error);
            setError('Failed to fetch worker account details');
        }
    };

    useEffect(() => {
        getWorkerDetails();
        const interval = setInterval(getWorkerDetails, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const handleFileSelect = (file) => {
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

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
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
                setMessageHide('Detection completed successfully!', 3000, true);
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
        <div className={styles.container}>
            <Head>
                <title>Deepfake Detection Agent</title>
                <meta name="description" content="AI-powered deepfake detection using NEAR Shade Agents" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            {/* Spline 3D Background */}
            <div className={styles.splineBackground}>
                <Spline
                    scene="https://prod.spline.design/T13hoFcu40hYf79c/scene.splinecode" 
                />
            </div>
            
            <Overlay message={message} />

            <main className={styles.main}>
                <h1 className={styles.title}>🤖 Deepfake Detection Agent</h1>
                <div className={styles.subtitleContainer}>
                    <h2 className={styles.subtitle}>Powered by NEAR Shade Agents</h2>
                </div>
                
                <p className={styles.description}>
                    Upload images or videos to detect AI-generated deepfakes using privacy-preserving TEE technology.
                    Your files are processed securely and never stored.
                </p>

                <div className={styles.featuresGrid}>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🔒</span>
                        <span>TEE Privacy</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🤖</span>
                        <span>AI Detection</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>⚡</span>
                        <span>Real-time</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✅</span>
                        <span>Verifiable</span>
                    </div>
                </div>

                {/* File Upload Area */}
                <div 
                    className={`${styles.uploadArea} ${dragOver ? styles.dragOver : ''} ${selectedFile ? styles.hasFile : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        style={{ display: 'none' }}
                    />
                    
                    {selectedFile ? (
                        <div className={styles.fileSelected}>
                            <div className={styles.fileIcon}>
                                {selectedFile.type.startsWith('image/') ? '🖼️' : '🎥'}
                            </div>
                            <div className={styles.fileInfo}>
                                <div className={styles.fileName}>{selectedFile.name}</div>
                                <div className={styles.fileSize}>
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                            </div>
                            <button 
                                className={styles.removeFile}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetDetection();
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <div className={styles.uploadPrompt}>
                            <div className={styles.uploadIcon}>📁</div>
                            <div className={styles.uploadText}>
                                <strong>Drop files here or click to upload</strong>
                                <br />
                                <small>Supports: JPG, PNG, MP4, MOV, AVI, WebM (max 50MB)</small>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Detection Button */}
                <button 
                    className={`${styles.detectButton} ${isProcessing ? styles.processing : ''}`}
                    onClick={detectDeepfake}
                    disabled={!selectedFile || isProcessing}
                >
                    {isProcessing ? (
                        <>
                            <span className={styles.spinner}></span>
                            🔄 Processing in TEE...
                        </>
                    ) : (
                        '🚀 Detect Deepfake'
                    )}
                </button>

                {/* Detection Results */}
                {detectionResult && (
                    <div className={styles.resultContainer}>
                        <h3>🎯 Detection Results</h3>
                        <div className={`${styles.resultCard} ${detectionResult.isDeepfake ? styles.deepfake : styles.authentic}`}>
                            <div className={styles.resultHeader}>
                                <span className={styles.resultIcon}>
                                    {detectionResult.isDeepfake ? '⚠️' : '✅'}
                                </span>
                                <span className={styles.resultStatus}>
                                    {detectionResult.isDeepfake ? 'Deepfake Detected' : 'Authentic Media'}
                                </span>
                            </div>
                            
                            <div className={styles.confidenceBar}>
                                <div className={styles.confidenceLabel}>
                                    Confidence: {(detectionResult.confidence * 100).toFixed(1)}%
                                </div>
                                <div className={styles.confidenceProgress}>
                                    <div 
                                        className={styles.confidenceFill}
                                        style={{ width: `${detectionResult.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className={styles.resultDetails}>
                                <div className={styles.detailRow}>
                                    <span>Model Version:</span>
                                    <span>{detectionResult.modelVersion}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>Processing Time:</span>
                                    <span>{detectionResult.processingTime}ms</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>TEE Verified:</span>
                                    <span>{detectionResult.teeVerified ? '✅ Yes' : '❌ No'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span>File Entropy:</span>
                                    <span>{detectionResult.features?.entropy?.toFixed(2) || 'N/A'}</span>
                                </div>
                            </div>

                            <div className={styles.securityBadges}>
                                <div className={styles.badge}>
                                    🔒 TEE Processed
                                </div>
                                <div className={styles.badge}>
                                    🤖 AI Verified
                                </div>
                                <div className={styles.badge}>
                                    🌐 NEAR Blockchain
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Worker Account Status */}
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h3>🔧 Shade Agent Status</h3>
                        <div className={styles.accountInfo}>
                            <p>
                                <strong>Worker Account:</strong><br />
                                {accountId ? (
                                    <>
                                        {accountId.length > 30 
                                            ? `${accountId.substring(0, 15)}...${accountId.substring(accountId.length - 10)}`
                                            : accountId
                                        }
                                        <button
                                            className={styles.copyBtn}
                                            onClick={() => {
                                                navigator.clipboard.writeText(accountId);
                                                setMessageHide('Account ID copied!', 1000, true);
                                            }}
                                        >
                                            📋
                                        </button>
                                    </>
                                ) : (
                                    'Loading...'
                                )}
                            </p>
                            <p>
                                <strong>Balance:</strong> {balance} NEAR
                            </p>
                            <p>
                                <strong>Status:</strong> <span className={styles.statusActive}>🟢 Active</span>
                            </p>
                        </div>
                        
                        {parseFloat(balance) < 1 && (
                            <div className={styles.lowBalanceWarning}>
                                ⚠️ Low balance! Get testnet NEAR from{' '}
                                <a 
                                    href="https://near-faucet.io/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.faucetLink}
                                >
                                    the faucet
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Section */}
                <div className={styles.infoSection}>
                    <h4>🔒 Privacy & Security</h4>
                    <ul className={styles.infoList}>
                        <li>✅ <strong>TEE Processing:</strong> Your files are processed in a secure enclave</li>
                        <li>✅ <strong>No Storage:</strong> Files are deleted immediately after processing</li>
                        <li>✅ <strong>Cryptographic Proofs:</strong> All results are verifiable</li>
                        <li>✅ <strong>Autonomous:</strong> No human can access your data</li>
                        <li>✅ <strong>Open Source:</strong> Transparent and auditable code</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
