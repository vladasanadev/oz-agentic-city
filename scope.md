# NEAR AI Deepfake Detection Agent - 1-Day MVP Scope

## 🎯 Project Overview

**Project Name:** NEAR AI Deepfake Detection Agent  
**Type:** 1-Day Hackathon MVP  
**Timeline:** Single day sprint  
**Goal:** Create a simple demo of decentralized deepfake detection concept using NEAR Protocol

## 🏗️ Simplified Architecture

```
React Frontend (Simple Components)
    ↓
NEAR Shade Agent (Mock AI Detection)
    ↓ 
NEAR Smart Contract (Result Storage)
    ↓
0G Network (File Storage)
```

## 🎯 Core Objectives (1-Day Focus)

### Must-Have (Day 1 Only)
- [ ] **Simple Web Interface**: Basic HTML page with file upload simulation
- [ ] **Mock AI Detection**: Pre-programmed responses for demo files
- [ ] **NEAR Contract**: Simple contract to store detection results
- [ ] **Demo Video**: One complete end-to-end demonstration
- [ ] **Working Prototype**: Can upload file and show "detection" result

### Out of Scope (Too Complex for 1 Day)
- ❌ Real TEE implementation
- ❌ Actual AI model training/inference
- ❌ Complex frontend frameworks
- ❌ IPFS integration
- ❌ Cryptographic proofs
- ❌ Testing suites

## 🛠️ Simplified Technology Stack

### Core Technologies (Minimal)
- **Blockchain**: NEAR Protocol (Shade Agents + Smart Contract)
- **Storage**: 0G Network (File storage)
- **Frontend**: React (Simple components, NEAR Wallet integration)
- **AI Agent**: Shade Agent with mock detection responses

## 📋 1-Day Implementation Timeline

### Morning (4 hours): Setup & Agent
- [ ] **Hour 1**: NEAR testnet + 0G Network setup
- [ ] **Hour 2**: Create simple NEAR smart contract
- [ ] **Hour 3**: Deploy Shade Agent with mock AI logic
- [ ] **Hour 4**: Test agent + contract integration

### Afternoon (4 hours): Frontend & Demo
- [ ] **Hour 5**: Create React app with NEAR Wallet
- [ ] **Hour 6**: Add file upload + 0G storage
- [ ] **Hour 7**: Connect to Shade Agent + display results
- [ ] **Hour 8**: Record demo video and polish

## 🔍 Technical Specifications

### Shade Agent Capabilities
- **Processing**: Image/video deepfake detection
- **Security**: Remote attestation for result verification
- **Autonomy**: Automatic result submission to NEAR contract
- **Privacy**: TEE ensures no data leakage during processing

### Detection Pipeline
1. **Input Validation**: File type, size, format checks
2. **Preprocessing**: Face extraction, frame sampling
3. **Model Inference**: Multi-model ensemble scoring
4. **Post-processing**: Confidence aggregation, metadata analysis
5. **Result Generation**: Structured output with cryptographic proof

### Smart Contract Functions
- `submit_detection_request(file_hash, metadata)`
- `store_detection_result(result_hash, confidence_score, proof)`
- `verify_detection_proof(proof_data)`
- `get_detection_history(user_address)`

## 📊 Success Metrics

### Technical Metrics
- [ ] **Detection Accuracy**: >85% on test dataset
- [ ] **Processing Time**: <30s for images, <2min for short videos
- [ ] **TEE Verification**: 100% cryptographic proof validation
- [ ] **Contract Gas Costs**: <0.1 NEAR per detection
- [ ] **Uptime**: >99% availability during demo period

### User Experience Metrics
- [ ] **Upload Success Rate**: >95% successful file uploads
- [ ] **Result Clarity**: Clear confidence scores and explanations
- [ ] **Response Time**: <5s for UI feedback after upload
- [ ] **Cross-browser Compatibility**: Works on major browsers

## 🎖️ Hackathon Deliverables

### Code Deliverables
- [ ] Complete source code repository
- [ ] Deployed smart contracts (testnet)
- [ ] Shade Agent implementation
- [ ] Frontend application (live demo)
- [ ] Documentation and setup guides

### Demo Materials
- [ ] Live demonstration video
- [ ] Presentation slides
- [ ] Technical architecture documentation
- [ ] Sample test cases and results
- [ ] Future roadmap and scaling plans

## 🚀 Innovation Highlights

### Technical Innovation
- **First-of-Kind**: Decentralized deepfake detection using TEE + blockchain
- **Verifiable AI**: Cryptographically provable detection results
- **Privacy-Preserving**: TEE ensures sensitive content protection
- **Autonomous Agents**: Self-executing AI with blockchain integration

### Market Differentiation
- **Decentralization**: No central authority or single point of failure
- **Transparency**: Open-source detection algorithms
- **Verifiability**: Blockchain-based proof of detection process
- **Scalability**: TEE infrastructure for high-performance processing

## 📈 Progress Tracking

### Daily Milestones
- **Day 1**: ✅ Environment setup and project foundation
- **Day 2**: 🔄 Core AI detection engine implementation
- **Day 3**: ⏳ Blockchain integration and smart contracts
- **Day 4**: ⏳ Frontend development and user interface
- **Day 5**: ⏳ Testing, optimization, and demo preparation

### Current Status
- **Overall Progress**: 0% (Starting Phase)
- **Next Priority**: Environment setup and basic project structure
- **Blockers**: None identified
- **Team Focus**: Foundation and core architecture

---

## 🔗 Resources & References

- **NEAR Shade Agents**: [NEAR.AI Documentation]
- **Phala Cloud TEE**: [Phala Network Docs]
- **DINOv2 Reference**: GitHub implementation for PCA analysis
- **Hackathon Details**: One Trillion Agents Hackathon ($102,550 prizes)
- **Detection Datasets**: Deepfake-Eval-2024 benchmark

---

*Last Updated: [Current Date]*  
*Project Status: 🚀 Initiated* 