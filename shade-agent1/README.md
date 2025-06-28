# 🤖 Aurora Deepfake Detector

An AI-powered deepfake detection system built with NEAR Shade Agents, featuring privacy-preserving TEE (Trusted Execution Environment) processing and a beautiful 3D interface.

![Aurora Deepfake Detector](https://img.shields.io/badge/NEAR-Shade%20Agents-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![TEE](https://img.shields.io/badge/TEE-Privacy%20Preserving-purple)

## 🌟 Features

### 🔒 Privacy & Security
- **TEE Processing**: Files processed in secure enclaves, ensuring complete privacy
- **No Data Storage**: All files are deleted immediately after processing
- **Cryptographic Proofs**: Verifiable results with blockchain transparency
- **Autonomous Operation**: No human can access your data during processing

### 🤖 AI Detection
- **Advanced ML Models**: State-of-the-art deepfake detection algorithms
- **Multi-format Support**: Images (JPG, PNG) and Videos (MP4, MOV, AVI, WebM)
- **Real-time Processing**: Fast detection with detailed confidence scores
- **Model Versioning**: Transparent model tracking and updates

### 🎨 User Experience
- **3D Spline Background**: Beautiful robot animation powered by Spline
- **Drag & Drop Interface**: Intuitive file upload system
- **Real-time Status**: Live updates on processing and account status
- **Responsive Design**: Works seamlessly across all devices

### ⛓️ Blockchain Integration
- **NEAR Protocol**: Built on NEAR blockchain for transparency
- **Chain Signatures**: Secure transaction signing capabilities
- **Testnet Support**: Full testnet integration for development
- **Account Management**: Automated worker account handling

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Shade Agent    │    │   NEAR Chain    │
│   (Next.js)     │◄──►│   (TEE)          │◄──►│   (Blockchain)  │
│                 │    │                  │    │                 │
│ • 3D Interface  │    │ • AI Processing  │    │ • Smart Contract│
│ • File Upload   │    │ • Privacy Layer  │    │ • Transactions  │
│ • Results UI    │    │ • Verification   │    │ • Key Management│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ and npm/yarn
- **Docker** and Docker Compose
- **NEAR CLI** (latest version)
- **Git** for version control

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shade-agent1

# Install dependencies
npm install

# Install required packages
npm install @splinetool/react-spline

# Create tmp directory for file uploads
mkdir -p tmp
```

### 2. NEAR Account Setup

```bash
# Install NEAR CLI (latest version)
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/near/near-cli-rs/releases/latest/download/near-cli-rs-installer.sh | sh

# Create a NEAR testnet account
near account create-account sponsor-by-faucet-service your-app-name-$(date +%s).testnet autogenerate-new-keypair print-to-terminal network-config testnet create
```

### 3. Environment Configuration

Create `.env.development.local`:

```env
# NEAR Account Configuration
NEAR_ACCOUNT_ID=your-account-name.testnet
NEAR_SEED_PHRASE="your twelve word seed phrase here"

# Contract Configuration  
NEXT_PUBLIC_contractId=your-account-name.testnet

# API Configuration
SHADE_AGENT_API_URL=http://shade-agent-api:3140
```

### 4. Development Server

```bash
# Start the development server
npm run dev

# Your app will be available at:
# http://localhost:3000
```

### 5. Docker Deployment (Optional)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or use Shade Agent CLI
shade-agent-cli
```

## 📖 Usage Guide

### Basic Operation

1. **Access the Application**
   - Open http://localhost:3000 in your browser
   - You'll see the beautiful 3D robot background

2. **Upload Media**
   - Drag and drop files or click to browse
   - Supported formats: JPG, PNG, MP4, MOV, AVI, WebM
   - Maximum file size: 50MB

3. **Detect Deepfakes**
   - Click "🚀 Detect Deepfake" button
   - Processing happens in TEE for privacy
   - Results show confidence score and details

4. **View Results**
   - ✅ Authentic media or ⚠️ Deepfake detected
   - Confidence percentage and technical details
   - Verification badges and security indicators

### Account Management

- **Worker Account**: Automatically managed Shade Agent account
- **Balance Monitoring**: Real-time NEAR token balance
- **Low Balance Alerts**: Notifications when balance is low
- **Faucet Integration**: Direct links to testnet token faucet

## 🔧 API Reference

### Frontend APIs

#### `/api/getWorkerAccount`
Get worker account details and balance
```javascript
GET /api/getWorkerAccount
Response: {
  accountId: "worker.account.testnet",
  balance: "5.2341",
  error?: string
}
```

#### `/api/detectDeepfake`
Process media for deepfake detection
```javascript
POST /api/detectDeepfake
Content-Type: multipart/form-data
Body: FormData with 'file' field

Response: {
  success: boolean,
  result?: {
    isDeepfake: boolean,
    confidence: number,
    modelVersion: string,
    processingTime: number,
    teeVerified: boolean,
    features: object
  },
  error?: string
}
```

### Shade Agent Integration

The application integrates with Shade Agents through:
- **TEE Processing**: Secure enclave execution
- **Chain Signatures**: Blockchain transaction signing
- **Worker Management**: Automated account handling
- **Result Verification**: Cryptographic proof generation

## 🛠️ Development

### Project Structure

```
shade-agent1/
├── pages/
│   ├── index.js              # Main application page
│   ├── _app.js               # Next.js app configuration
│   └── api/
│       ├── detectDeepfake.js # Deepfake detection API
│       ├── getWorkerAccount.js # Account management API
│       └── sendTransaction.js # Blockchain transactions
├── styles/
│   ├── globals.css           # Global styles
│   └── Home.module.css       # Component-specific styles
├── components/
│   └── Overlay.js            # UI overlay component
├── utils/
│   ├── ethereum.js           # Ethereum integration
│   └── fetch-eth-price.js    # Price fetching utilities
├── public/                   # Static assets
├── tmp/                      # Temporary file storage
├── docker-compose.yaml       # Docker configuration
├── Dockerfile               # Container definition
├── package.json             # Node.js dependencies
└── .env.development.local   # Environment variables
```

### Key Components

#### Frontend (`pages/index.js`)
- React hooks for state management
- File upload with drag-and-drop
- Real-time status updates
- 3D Spline background integration
- Responsive design system

#### Styling (`styles/Home.module.css`)
- CSS Modules for component isolation
- Glassmorphism design elements
- Animated loading states
- Responsive breakpoints
- Dark theme optimized

#### APIs (`pages/api/`)
- RESTful endpoint design
- Error handling and validation
- Integration with Shade Agent services
- File processing pipeline

### Development Workflow

1. **Local Development**
   ```bash
   npm run dev          # Start development server
   npm run build        # Build for production
   npm run start        # Start production server
   ```

2. **Testing**
   ```bash
   # Test file upload
   curl -X POST -F "file=@test.jpg" http://localhost:3000/api/detectDeepfake
   
   # Test account API
   curl http://localhost:3000/api/getWorkerAccount
   ```

3. **Docker Testing**
   ```bash
   docker-compose up --build
   docker-compose logs -f
   ```

## 🚨 Troubleshooting

### Common Issues

#### 1. "shade-agent-api ENOTFOUND" Error
**Problem**: Cannot connect to Shade Agent API service
**Solution**: 
```bash
# Check Docker services
docker-compose ps

# Restart Docker services
docker-compose down && docker-compose up --build

# Check network connectivity
docker network ls
```

#### 2. "File not found in tmp/" Error
**Problem**: Missing temporary directory
**Solution**:
```bash
mkdir -p tmp
chmod 755 tmp
```

#### 3. NEAR Account Key Errors
**Problem**: Missing or invalid key pairs
**Solution**:
```bash
# Re-create account with proper keys
near account create-account sponsor-by-faucet-service new-account-$(date +%s).testnet autogenerate-new-keypair save-to-keychain network-config testnet create

# Update .env.development.local with new credentials
```

#### 4. Spline Loading Issues
**Problem**: 3D background not loading
**Solution**:
```bash
# Verify Spline package installation
npm list @splinetool/react-spline

# Reinstall if needed
npm uninstall @splinetool/react-spline
npm install @splinetool/react-spline
```

#### 5. Docker Build Timeouts
**Problem**: Docker build fails with timeout
**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Use different base image mirror
# Edit Dockerfile to use different registry if needed
```

### Debug Mode

Enable verbose logging:
```bash
# Set debug environment
DEBUG=shade-agent:* npm run dev

# Check application logs
tail -f logs/application.log
```

### Performance Optimization

1. **File Size Limits**: Keep uploads under 50MB
2. **Network**: Ensure stable internet for blockchain operations
3. **Memory**: Minimum 4GB RAM recommended for local development
4. **Storage**: At least 2GB free space for Docker images

## 🔐 Security Considerations

### TEE Security
- All file processing happens in Trusted Execution Environment
- No data persistence on disk
- Cryptographic attestation of results
- Isolated execution prevents data leaks

### Blockchain Security
- Private keys managed securely
- Transactions signed in secure enclaves
- Regular security audits of smart contracts
- Testnet environment for safe development

### Frontend Security
- Input validation on all file uploads
- XSS protection enabled
- CORS properly configured
- No sensitive data in client-side code

## 🌐 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   # Production environment variables
   NODE_ENV=production
   NEAR_NETWORK=testnet  # or mainnet
   SHADE_AGENT_NETWORK=production
   ```

2. **Docker Production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Monitoring**
   - Application health checks
   - Blockchain transaction monitoring
   - TEE attestation verification
   - Performance metrics collection

### Scaling Considerations

- **Horizontal Scaling**: Multiple Shade Agent workers
- **Load Balancing**: Distribute file processing load
- **CDN Integration**: Serve static assets efficiently
- **Database Scaling**: If adding persistent storage

## 🤝 Contributing

### Development Guidelines

1. **Code Style**
   - Use ESLint configuration
   - Follow React best practices
   - Write descriptive commit messages
   - Add JSDoc comments for functions

2. **Pull Request Process**
   - Fork the repository
   - Create feature branch
   - Add tests for new features
   - Update documentation
   - Submit pull request

3. **Testing Requirements**
   - Unit tests for utility functions
   - Integration tests for API endpoints
   - End-to-end tests for user workflows
   - Performance tests for file processing

### Bug Reports

Please include:
- Operating system and version
- Node.js and npm versions
- Steps to reproduce
- Expected vs actual behavior
- Console error messages
- Network connectivity information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NEAR Protocol** for blockchain infrastructure
- **Shade Agents** for TEE technology
- **Spline** for 3D graphics capabilities
- **OpenAI** for AI model inspiration
- **Docker** for containerization support

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Community**: Join NEAR Discord for community support
- **Professional**: Contact team for enterprise support

---

**Built with ❤️ for the NEAR ecosystem**

*Privacy-preserving AI detection powered by Shade Agents*
