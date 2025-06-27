const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeepfakeDetector", function () {
  let deepfakeDetector;
  let owner;
  let detector;
  let user;

  beforeEach(async function () {
    [owner, detector, user] = await ethers.getSigners();
    
    const DeepfakeDetector = await ethers.getContractFactory("DeepfakeDetector");
    deepfakeDetector = await DeepfakeDetector.deploy();
    await deepfakeDetector.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await deepfakeDetector.owner()).to.equal(owner.address);
    });

    it("Should authorize owner as detector", async function () {
      expect(await deepfakeDetector.authorizedDetectors(owner.address)).to.be.true;
    });

    it("Should start with zero detections", async function () {
      expect(await deepfakeDetector.getTotalDetections()).to.equal(0);
    });
  });

  describe("Detection Storage", function () {
    const fileHash = "abc123def456";
    const confidence = 85;
    const analysisReason = "Facial inconsistencies detected";
    const modelVersion = "v1.0";
    const processingTime = 2500;

    it("Should store detection result", async function () {
      await deepfakeDetector.storeDetectionResult(
        fileHash,
        true,
        confidence,
        analysisReason,
        modelVersion,
        processingTime
      );

      const result = await deepfakeDetector.getDetectionResult(fileHash);
      expect(result.fileHash).to.equal(fileHash);
      expect(result.isDeepfake).to.be.true;
      expect(result.confidence).to.equal(confidence);
      expect(result.analysisReason).to.equal(analysisReason);
      expect(result.detector).to.equal(owner.address);
    });

    it("Should prevent duplicate file processing", async function () {
      await deepfakeDetector.storeDetectionResult(
        fileHash,
        true,
        confidence,
        analysisReason,
        modelVersion,
        processingTime
      );

      await expect(
        deepfakeDetector.storeDetectionResult(
          fileHash,
          false,
          90,
          "Different analysis",
          modelVersion,
          3000
        )
      ).to.be.revertedWith("File already processed");
    });

    it("Should reject invalid confidence values", async function () {
      await expect(
        deepfakeDetector.storeDetectionResult(
          fileHash,
          true,
          101, // Invalid confidence > 100
          analysisReason,
          modelVersion,
          processingTime
        )
      ).to.be.revertedWith("Confidence must be 0-100");
    });

    it("Should only allow authorized detectors", async function () {
      await expect(
        deepfakeDetector.connect(user).storeDetectionResult(
          fileHash,
          true,
          confidence,
          analysisReason,
          modelVersion,
          processingTime
        )
      ).to.be.revertedWith("Not authorized detector");
    });
  });

  describe("Authorization", function () {
    it("Should authorize new detector", async function () {
      await deepfakeDetector.setDetectorAuthorization(detector.address, true);
      expect(await deepfakeDetector.authorizedDetectors(detector.address)).to.be.true;
    });

    it("Should deauthorize detector", async function () {
      await deepfakeDetector.setDetectorAuthorization(detector.address, true);
      await deepfakeDetector.setDetectorAuthorization(detector.address, false);
      expect(await deepfakeDetector.authorizedDetectors(detector.address)).to.be.false;
    });

    it("Should only allow owner to manage authorization", async function () {
      await expect(
        deepfakeDetector.connect(user).setDetectorAuthorization(detector.address, true)
      ).to.be.revertedWithCustomError(deepfakeDetector, "OwnableUnauthorizedAccount");
    });
  });

  describe("Statistics", function () {
    beforeEach(async function () {
      // Add some test data
      await deepfakeDetector.storeDetectionResult("hash1", true, 85, "Deepfake", "v1.0", 2500);
      await deepfakeDetector.storeDetectionResult("hash2", false, 95, "Authentic", "v1.0", 2000);
      await deepfakeDetector.storeDetectionResult("hash3", true, 75, "Deepfake", "v1.0", 3000);
    });

    it("Should return correct total detections", async function () {
      expect(await deepfakeDetector.getTotalDetections()).to.equal(3);
    });

    it("Should calculate deepfake percentage correctly", async function () {
      // 2 out of 3 are deepfakes = 66.66% = 6666 (scaled by 100)
      const percentage = await deepfakeDetector.getDeepfakePercentage();
      expect(percentage).to.equal(6666);
    });

    it("Should return contract stats", async function () {
      const [total, deepfakeCount, authenticCount] = await deepfakeDetector.getContractStats();
      expect(total).to.equal(3);
      expect(deepfakeCount).to.equal(2);
      expect(authenticCount).to.equal(1);
    });
  });

  describe("User Analytics", function () {
    it("Should track user statistics", async function () {
      await deepfakeDetector.storeDetectionResult("hash1", true, 85, "Deepfake", "v1.0", 2500);
      await deepfakeDetector.storeDetectionResult("hash2", false, 95, "Authentic", "v1.0", 2000);

      const analytics = await deepfakeDetector.getUserAnalytics(owner.address);
      expect(analytics.totalAnalyses).to.equal(2);
      expect(analytics.deepfakeDetected).to.equal(1);
      expect(analytics.authenticDetected).to.equal(1);
    });

    it("Should return user detection history", async function () {
      await deepfakeDetector.storeDetectionResult("hash1", true, 85, "Deepfake", "v1.0", 2500);
      await deepfakeDetector.storeDetectionResult("hash2", false, 95, "Authentic", "v1.0", 2000);

      const history = await deepfakeDetector.getUserDetectionHistory(owner.address);
      expect(history).to.deep.equal(["hash1", "hash2"]);
    });
  });
}); 