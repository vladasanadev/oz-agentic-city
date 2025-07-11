// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeepfakeDetector {
    struct DetectionResult {
        string fileHash;
        string filename;
        bool isDeepfake;
        uint8 confidence;
        uint256 timestamp;
        address agent;
        string agentId;
    }
    
    mapping(string => DetectionResult) public results;
    uint256 public totalScans;
    
    event DetectionRequested(string indexed fileHash, string filename, address requester);
    event DetectionStored(string indexed fileHash, bool isDeepfake, uint8 confidence, address agent, string agentId);
    
    // Anyone can store detection results (simplified for MVP)
    function storeResult(
        string memory fileHash,
        string memory filename,
        bool isDeepfake,
        uint8 confidence,
        string memory agentId
    ) public {
        require(confidence <= 100, "Confidence must be <= 100");
        
        DetectionResult memory result = DetectionResult({
            fileHash: fileHash,
            filename: filename,
            isDeepfake: isDeepfake,
            confidence: confidence,
            timestamp: block.timestamp,
            agent: msg.sender,
            agentId: agentId
        });
        
        results[fileHash] = result;
        totalScans++;
        
        emit DetectionStored(fileHash, isDeepfake, confidence, msg.sender, agentId);
    }
    
    // Public function to request detection (triggers off-chain agent)
    function requestDetection(string memory fileHash, string memory filename) public {
        emit DetectionRequested(fileHash, filename, msg.sender);
    }
    
    // Immediate mock detection for MVP (processes request instantly)
    function requestDetectionWithResult(string memory fileHash, string memory filename) public {
        // Emit request event
        emit DetectionRequested(fileHash, filename, msg.sender);
        
        // Generate mock result immediately
        bool isDeepfake = _mockDetection(filename, fileHash);
        uint8 confidence = uint8(75 + (uint256(keccak256(abi.encodePacked(fileHash))) % 20)); // 75-95%
        
        // Store result immediately
        DetectionResult memory result = DetectionResult({
            fileHash: fileHash,
            filename: filename,
            isDeepfake: isDeepfake,
            confidence: confidence,
            timestamp: block.timestamp,
            agent: address(this), // Contract itself as agent
            agentId: "built-in-ai-agent"
        });
        
        results[fileHash] = result;
        totalScans++;
        
        emit DetectionStored(fileHash, isDeepfake, confidence, address(this), "built-in-ai-agent");
    }
    
    // Mock AI detection logic
    function _mockDetection(string memory filename, string memory fileHash) private pure returns (bool) {
        bytes memory nameBytes = bytes(filename);
        
        // Check for "fake", "deep", "synthetic" in filename
        if (_contains(nameBytes, "fake") || _contains(nameBytes, "deep") || _contains(nameBytes, "synthetic")) {
            return true; // Deepfake detected
        }
        
        // Check for "real", "authentic", "original" in filename
        if (_contains(nameBytes, "real") || _contains(nameBytes, "authentic") || _contains(nameBytes, "original")) {
            return false; // Authentic
        }
        
        // Hash-based pseudo-random detection (25% chance of deepfake)
        uint256 hashNum = uint256(keccak256(abi.encodePacked(fileHash)));
        return (hashNum % 4) == 0;
    }
    
    // Helper function to check if bytes contain a substring
    function _contains(bytes memory haystack, string memory needle) private pure returns (bool) {
        bytes memory needleBytes = bytes(needle);
        if (needleBytes.length > haystack.length) return false;
        
        for (uint i = 0; i <= haystack.length - needleBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < needleBytes.length; j++) {
                if (haystack[i + j] != needleBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
    
    // View functions
    function getResult(string memory fileHash) 
        public 
        view 
        returns (DetectionResult memory) 
    {
        return results[fileHash];
    }
    
    function getTotalScans() public view returns (uint256) {
        return totalScans;
    }
    
    // Check if result exists for a file hash
    function hasResult(string memory fileHash) public view returns (bool) {
        return bytes(results[fileHash].fileHash).length > 0;
    }
} 