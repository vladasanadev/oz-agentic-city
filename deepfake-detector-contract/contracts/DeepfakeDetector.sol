// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DeepfakeDetector
 * @dev Smart contract for storing deepfake detection results on Aurora/NEAR
 */
contract DeepfakeDetector is Ownable, ReentrancyGuard {
    // Counter for total detections
    uint256 private _detectionCounter;
    
    // Detection result structure
    struct DetectionResult {
        string fileHash;
        bool isDeepfake;
        uint8 confidence; // 0-100
        string analysisReason;
        string modelVersion;
        address detector; // Who performed the detection
        uint256 timestamp;
        uint256 processingTime; // in milliseconds
        bool verified; // Admin verification flag
    }
    
    // User analysis structure
    struct UserAnalysis {
        uint256 totalAnalyses;
        uint256 deepfakeDetected;
        uint256 authenticDetected;
        uint256 lastAnalysisTime;
    }
    
    // Mappings
    mapping(string => DetectionResult) public detectionResults; // fileHash => result
    mapping(string => bool) public processedHashes; // Track processed files
    mapping(address => UserAnalysis) public userAnalytics;
    mapping(address => string[]) public userFileHashes; // User's detection history
    mapping(address => bool) public authorizedDetectors; // Authorized detection agents
    
    // Arrays for iteration
    string[] public allFileHashes;
    
    // Events
    event DetectionStored(
        string indexed fileHash,
        address indexed detector,
        bool isDeepfake,
        uint8 confidence,
        uint256 timestamp
    );
    
    event DetectorAuthorized(address indexed detector, bool authorized);
    event ResultVerified(string indexed fileHash, bool verified);
    
    // Modifiers
    modifier onlyAuthorizedDetector() {
        require(
            authorizedDetectors[msg.sender] || msg.sender == owner(),
            "Not authorized detector"
        );
        _;
    }
    
    modifier validConfidence(uint8 _confidence) {
        require(_confidence <= 100, "Confidence must be 0-100");
        _;
    }
    
    modifier fileNotProcessed(string memory _fileHash) {
        require(!processedHashes[_fileHash], "File already processed");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        // Owner is automatically authorized
        authorizedDetectors[msg.sender] = true;
    }
    
    /**
     * @dev Store detection result on-chain
     * @param _fileHash SHA-256 hash of the analyzed file
     * @param _isDeepfake Whether the file is detected as deepfake
     * @param _confidence Confidence level (0-100)
     * @param _analysisReason Reason for the detection result
     * @param _modelVersion Version of the AI model used
     * @param _processingTime Time taken to process (in milliseconds)
     */
    function storeDetectionResult(
        string memory _fileHash,
        bool _isDeepfake,
        uint8 _confidence,
        string memory _analysisReason,
        string memory _modelVersion,
        uint256 _processingTime
    ) 
        external 
        onlyAuthorizedDetector 
        validConfidence(_confidence)
        fileNotProcessed(_fileHash)
        nonReentrant 
    {
        // Create detection result
        DetectionResult memory result = DetectionResult({
            fileHash: _fileHash,
            isDeepfake: _isDeepfake,
            confidence: _confidence,
            analysisReason: _analysisReason,
            modelVersion: _modelVersion,
            detector: msg.sender,
            timestamp: block.timestamp,
            processingTime: _processingTime,
            verified: false
        });
        
        // Store result
        detectionResults[_fileHash] = result;
        processedHashes[_fileHash] = true;
        allFileHashes.push(_fileHash);
        userFileHashes[msg.sender].push(_fileHash);
        
        // Update counters
        _detectionCounter++;
        
        // Update user analytics
        UserAnalysis storage userStats = userAnalytics[msg.sender];
        userStats.totalAnalyses++;
        userStats.lastAnalysisTime = block.timestamp;
        
        if (_isDeepfake) {
            userStats.deepfakeDetected++;
        } else {
            userStats.authenticDetected++;
        }
        
        emit DetectionStored(_fileHash, msg.sender, _isDeepfake, _confidence, block.timestamp);
    }
    
    /**
     * @dev Get detection result by file hash
     * @param _fileHash SHA-256 hash of the file
     * @return DetectionResult struct
     */
    function getDetectionResult(string memory _fileHash) 
        external 
        view 
        returns (DetectionResult memory) 
    {
        require(processedHashes[_fileHash], "File not processed");
        return detectionResults[_fileHash];
    }
    
    /**
     * @dev Check if file has been processed
     * @param _fileHash SHA-256 hash of the file
     * @return bool indicating if file was processed
     */
    function isFileProcessed(string memory _fileHash) external view returns (bool) {
        return processedHashes[_fileHash];
    }
    
    /**
     * @dev Get user's detection history
     * @param _user Address of the user
     * @return Array of file hashes analyzed by user
     */
    function getUserDetectionHistory(address _user) 
        external 
        view 
        returns (string[] memory) 
    {
        return userFileHashes[_user];
    }
    
    /**
     * @dev Get user analytics
     * @param _user Address of the user
     * @return UserAnalysis struct
     */
    function getUserAnalytics(address _user) 
        external 
        view 
        returns (UserAnalysis memory) 
    {
        return userAnalytics[_user];
    }
    
    /**
     * @dev Get total number of detections
     * @return Total detection count
     */
    function getTotalDetections() external view returns (uint256) {
        return _detectionCounter;
    }
    
    /**
     * @dev Get deepfake detection percentage
     * @return Percentage of files detected as deepfakes (scaled by 100)
     */
    function getDeepfakePercentage() external view returns (uint256) {
        uint256 total = _detectionCounter;
        if (total == 0) return 0;
        
        uint256 deepfakeCount = 0;
        for (uint256 i = 0; i < allFileHashes.length; i++) {
            if (detectionResults[allFileHashes[i]].isDeepfake) {
                deepfakeCount++;
            }
        }
        
        return (deepfakeCount * 10000) / total; // Returns percentage * 100 (e.g., 2550 = 25.50%)
    }
    
    /**
     * @dev Get recent detections
     * @param _limit Maximum number of results to return
     * @return Array of recent file hashes
     */
    function getRecentDetections(uint256 _limit) 
        external 
        view 
        returns (string[] memory) 
    {
        uint256 total = allFileHashes.length;
        if (total == 0) {
            return new string[](0);
        }
        
        uint256 returnCount = _limit > total ? total : _limit;
        string[] memory recent = new string[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recent[i] = allFileHashes[total - 1 - i]; // Return in reverse order (newest first)
        }
        
        return recent;
    }
    
    /**
     * @dev Authorize/deauthorize detection agent
     * @param _detector Address of the detector
     * @param _authorized Whether to authorize or deauthorize
     */
    function setDetectorAuthorization(address _detector, bool _authorized) 
        external 
        onlyOwner 
    {
        authorizedDetectors[_detector] = _authorized;
        emit DetectorAuthorized(_detector, _authorized);
    }
    
    /**
     * @dev Verify detection result (admin function)
     * @param _fileHash Hash of the file to verify
     * @param _verified Verification status
     */
    function verifyDetectionResult(string memory _fileHash, bool _verified) 
        external 
        onlyOwner 
    {
        require(processedHashes[_fileHash], "File not processed");
        detectionResults[_fileHash].verified = _verified;
        emit ResultVerified(_fileHash, _verified);
    }
    
    /**
     * @dev Get contract statistics
     * @return total detections, deepfake count, authentic count
     */
    function getContractStats() 
        external 
        view 
        returns (uint256 total, uint256 deepfakeCount, uint256 authenticCount) 
    {
        total = _detectionCounter;
        
        for (uint256 i = 0; i < allFileHashes.length; i++) {
            if (detectionResults[allFileHashes[i]].isDeepfake) {
                deepfakeCount++;
            } else {
                authenticCount++;
            }
        }
        
        return (total, deepfakeCount, authenticCount);
    }
    
    /**
     * @dev Emergency function to pause contract (if needed)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Allow contract to receive ETH for gas payments
    receive() external payable {}
} 