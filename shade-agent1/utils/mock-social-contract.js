// Mock social contract for testing when NEAR Social isn't available
import { getWallet, isSignedIn, getAccountId } from './near-wallet';

// In-memory storage for testing (would be blockchain in real contract)
let mockPosts = [];
let mockStats = {
  totalDetections: 0,
  deepfakeDetections: 0,
  authenticDetections: 0,
  uniqueContributors: 0
};

// Mock social contract functions
export async function mockShareDetectionResult(result, message = '') {
  try {
    const signedIn = await isSignedIn();
    if (!signedIn) {
      throw new Error('Please connect your NEAR wallet first');
    }

    const accountId = await getAccountId();
    const timestamp = Date.now();
    
    const postData = {
      type: 'deepfake_detection',
      version: '1.0',
      result: {
        isDeepfake: result.isDeepfake,
        confidence: Math.round(result.confidence * 100),
        modelVersion: result.modelVersion,
        teeVerified: result.teeVerified,
        processingTime: result.processingTime
      },
      metadata: {
        fileHash: result.fileHash?.substring(0, 16) + '...',
        timestamp: timestamp,
        appVersion: 'NEAR Shade Agent v1.0'
      },
      message: message || (result.isDeepfake ? 
        `🚨 Deepfake detected with ${Math.round(result.confidence * 100)}% confidence` : 
        `✅ Authentic content verified with ${Math.round(result.confidence * 100)}% confidence`
      ),
      accountId: accountId
    };

    // Store in mock storage
    mockPosts.unshift(postData);
    
    // Update stats
    mockStats.totalDetections++;
    if (result.isDeepfake) mockStats.deepfakeDetections++;
    else mockStats.authenticDetections++;
    
    const contributors = new Set(mockPosts.map(p => p.accountId));
    mockStats.uniqueContributors = contributors.size;

    console.log('✅ Mock: Successfully shared detection result');

    return {
      success: true,
      transactionHash: 'mock-tx-' + timestamp,
      postData: postData,
      socialUrl: `https://near.social/post/${accountId}@${timestamp}`
    };

  } catch (error) {
    console.error('❌ Mock: Failed to share result:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function mockGetCommunityFeed(limit = 50) {
  try {
    console.log('📡 Mock: Fetching community detection feed...');
    
    const posts = mockPosts.slice(0, limit).map(post => ({
      ...post,
      socialUrl: `https://near.social/post/${post.accountId}@${post.metadata?.timestamp}`
    }));

    console.log(`✅ Mock: Found ${posts.length} detection posts`);

    return {
      success: true,
      posts: posts,
      totalCount: posts.length
    };

  } catch (error) {
    console.error('❌ Mock: Failed to get community feed:', error);
    return {
      success: false,
      error: error.message,
      posts: []
    };
  }
}

export async function mockGetCommunityStats() {
  try {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentPosts = mockPosts.filter(post => 
      post.metadata?.timestamp && post.metadata.timestamp > oneDayAgo
    ).length;

    return {
      success: true,
      stats: {
        ...mockStats,
        postsLast24h: recentPosts,
        averageConfidence: mockPosts.length > 0 
          ? Math.round(mockPosts.reduce((sum, post) => sum + (post.result?.confidence || 0), 0) / mockPosts.length)
          : 0,
        deepfakeRate: mockStats.totalDetections > 0 
          ? Math.round((mockStats.deepfakeDetections / mockStats.totalDetections) * 100) 
          : 0
      }
    };

  } catch (error) {
    console.error('❌ Mock: Failed to get community stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function mockLikeDetectionPost(postAccountId, postTimestamp) {
  try {
    const signedIn = await isSignedIn();
    if (!signedIn) {
      throw new Error('Please connect your NEAR wallet first');
    }

    console.log('👍 Mock: Liking detection post...');

    // Simulate successful like
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      transactionHash: 'mock-like-' + Date.now()
    };

  } catch (error) {
    console.error('❌ Mock: Failed to like post:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Add some sample data for testing
export function addMockSampleData() {
  const samplePosts = [
    {
      type: 'deepfake_detection',
      version: '1.0',
      result: {
        isDeepfake: true,
        confidence: 89,
        modelVersion: 'v1.0',
        teeVerified: true,
        processingTime: 2340
      },
      metadata: {
        fileHash: '1234567890abcdef...',
        timestamp: Date.now() - 3600000,
        appVersion: 'NEAR Shade Agent v1.0'
      },
      message: '🚨 Deepfake detected with 89% confidence using NEAR Shade Agent TEE processing',
      accountId: 'alice.testnet'
    },
    {
      type: 'deepfake_detection',
      version: '1.0',
      result: {
        isDeepfake: false,
        confidence: 94,
        modelVersion: 'v1.0',
        teeVerified: true,
        processingTime: 1890
      },
      metadata: {
        fileHash: 'abcdef1234567890...',
        timestamp: Date.now() - 7200000,
        appVersion: 'NEAR Shade Agent v1.0'
      },
      message: '✅ Authentic content verified with 94% confidence using NEAR Shade Agent TEE processing',
      accountId: 'bob.testnet'
    }
  ];

  mockPosts = [...samplePosts, ...mockPosts];
  mockStats.totalDetections = mockPosts.length;
  mockStats.deepfakeDetections = mockPosts.filter(p => p.result?.isDeepfake).length;
  mockStats.authenticDetections = mockStats.totalDetections - mockStats.deepfakeDetections;
  mockStats.uniqueContributors = new Set(mockPosts.map(p => p.accountId)).size;

  console.log('✅ Mock: Added sample data for testing');
} 