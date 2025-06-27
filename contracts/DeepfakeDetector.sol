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
    mapping(address => bool) public authorizedAgents;
    mapping(address => uint256) public agentScans;
    
    uint256 public totalScans;
    address public owner;
    
    event DetectionStored(
        string indexed fileHash,
        bool isDeepfake,
        uint8 confidence,
        address agent,
        string agentId
    );
    
    event AgentAuthorized(address agent, string agentId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "Only authorized agents can store results");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    // Owner authorizes AI agents
    function authorizeAgent(address agent, string memory agentId) public onlyOwner {
        authorizedAgents[agent] = true;
        emit AgentAuthorized(agent, agentId);
    }
    
    // Agents store detection results
    function storeResult(
        string memory fileHash,
        string memory filename,
        bool isDeepfake,
        uint8 confidence,
        string memory agentId
    ) public onlyAuthorizedAgent {
        require(confidence <= 100, "Confidence must be <= 100");
        require(bytes(results[fileHash].fileHash).length == 0, "Result already exists");
        
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
        agentScans[msg.sender]++;
        totalScans++;
        
        emit DetectionStored(fileHash, isDeepfake, confidence, msg.sender, agentId);
    }
    
    // Public function to request detection (triggers off-chain agent)
    function requestDetection(string memory fileHash, string memory filename) public {
        // This emits an event that off-chain agents listen to
        emit DetectionRequested(fileHash, filename, msg.sender);
    }
    
    event DetectionRequested(string indexed fileHash, string filename, address requester);
    
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
    
    function getAgentScans(address agent) public view returns (uint256) {
        return agentScans[agent];
    }
    
    function isAgentAuthorized(address agent) public view returns (bool) {
        return authorizedAgents[agent];
    }
    
    // Emergency functions
    function removeAgent(address agent) public onlyOwner {
        authorizedAgents[agent] = false;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
} 