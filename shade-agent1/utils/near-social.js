import { Contract } from 'near-api-js';
import { getWallet, isSignedIn, getAccountId } from './near-wallet';
import { 
  mockShareDetectionResult, 
  mockGetCommunityFeed, 
  mockGetCommunityStats, 
  mockLikeDetectionPost,
  addMockSampleData 
} from './mock-social-contract';

// NEAR Social contract configuration
// Use testnet version for development
const SOCIAL_CONTRACT = process.env.NODE_ENV === 'production' 
  ? 'social.near'  // Mainnet
  : 'v1.social08.testnet';  // Testnet

// Enable mock mode for testing when social contract isn't available
const USE_MOCK_SOCIAL = process.env.NEXT_PUBLIC_USE_MOCK_SOCIAL === 'true';

// Track whether we should use mock mode (determined at runtime)
let shouldUseMock = USE_MOCK_SOCIAL;

// Initialize connection to NEAR Social contract
async function getSocialContract() {
  try {
    const wallet = await getWallet();
    const account = wallet.account();
    
    return new Contract(account, SOCIAL_CONTRACT, {
      changeMethods: ['set', 'like', 'comment'],
      viewMethods: ['get', 'get_post', 'get_posts']
    });
  } catch (error) {
    console.error('❌ Failed to initialize social contract:', error);
    throw new Error(`Social contract ${SOCIAL_CONTRACT} not available. Please check network or contract address.`);
  }
}

// Share a deepfake detection result on NEAR Social
export async function shareDetectionResult(result, message = '') {
  // Check if we should use mock mode
  if (shouldUseMock) {
    return await mockShareDetectionResult(result, message);
  }

  try {
    const signedIn = await isSignedIn();
    if (!signedIn) {
      throw new Error('Please connect your NEAR wallet first');
    }

    const accountId = await getAccountId();
    const contract = await getSocialContract();

    // Create social post data
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
        fileHash: result.fileHash?.substring(0, 16) + '...', // Privacy-safe partial hash
        timestamp: timestamp,
        appVersion: 'NEAR Shade Agent v1.0'
      },
      message: message || (result.isDeepfake ? 
        `🚨 Deepfake detected with ${Math.round(result.confidence * 100)}% confidence` : 
        `✅ Authentic content verified with ${Math.round(result.confidence * 100)}% confidence`
      )
    };

    // Post to NEAR Social
    const socialData = {
      [accountId]: {
        post: {
          main: JSON.stringify(postData)
        },
        index: {
          post: JSON.stringify({
            key: 'main',
            value: {
              type: 'md',
              data: postData.message
            }
          })
        }
      }
    };

    console.log('📱 Sharing detection result on NEAR Social...', postData);

    const result_tx = await contract.set({
      data: socialData
    }, '300000000000000', '100000000000000000000000'); // 0.1 NEAR deposit

    console.log('✅ Successfully shared on NEAR Social:', result_tx);

    return {
      success: true,
      transactionHash: result_tx.transaction?.hash,
      postData: postData,
      socialUrl: `https://near.social/post/${accountId}@${timestamp}`
    };

  } catch (error) {
    console.error('❌ Failed to share on NEAR Social:', error);
    
    // If social contract isn't available, fall back to mock mode
    if (error.message.includes('not available') || error.message.includes('does not exist')) {
      console.log('📝 Falling back to mock social contract for testing');
      shouldUseMock = true;
      return await mockShareDetectionResult(result, message);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Get community feed of shared detection results
export async function getCommunityFeed(limit = 50) {
  // Check if we should use mock mode
  if (shouldUseMock) {
    // Add sample data for testing
    addMockSampleData();
    return await mockGetCommunityFeed(limit);
  }

  try {
    const contract = await getSocialContract();

    console.log('📡 Fetching community detection feed...');

    // Get recent posts with deepfake detection type
    const posts = await contract.get({
      keys: ['*/post/main'],
      options: {
        limit: limit,
        order: 'desc'
      }
    });

    const detectionPosts = [];

    if (posts) {
      // Process posts to find deepfake detection results
      Object.entries(posts).forEach(([accountId, userData]) => {
        if (userData.post && userData.post.main) {
          try {
            const postData = JSON.parse(userData.post.main);
            
            // Filter for deepfake detection posts
            if (postData.type === 'deepfake_detection') {
              detectionPosts.push({
                accountId: accountId,
                ...postData,
                socialUrl: `https://near.social/post/${accountId}@${postData.metadata?.timestamp}`
              });
            }
          } catch (parseError) {
            // Skip invalid JSON posts
            console.warn('⚠️ Failed to parse post from', accountId);
          }
        }
      });
    }

    // Sort by timestamp (newest first)
    detectionPosts.sort((a, b) => 
      (b.metadata?.timestamp || 0) - (a.metadata?.timestamp || 0)
    );

    console.log(`✅ Found ${detectionPosts.length} detection posts in community feed`);

    return {
      success: true,
      posts: detectionPosts,
      totalCount: detectionPosts.length
    };

  } catch (error) {
    console.error('❌ Failed to get community feed:', error);
    
    // If social contract isn't available, fall back to mock mode
    if (error.message.includes('not available') || error.message.includes('does not exist')) {
      console.log('📝 Falling back to mock social contract for testing');
      shouldUseMock = true;
      addMockSampleData();
      return await mockGetCommunityFeed(limit);
    }
    
    return {
      success: false,
      error: error.message,
      posts: []
    };
  }
}

// Get specific user's detection history
export async function getUserDetectionHistory(accountId, limit = 20) {
  try {
    const contract = await getSocialContract();

    console.log('👤 Fetching detection history for', accountId);

    const userPosts = await contract.get({
      keys: [`${accountId}/post/main`],
      options: { limit: limit }
    });

    const detectionPosts = [];

    if (userPosts && userPosts[accountId]?.post?.main) {
      try {
        const posts = Array.isArray(userPosts[accountId].post.main) 
          ? userPosts[accountId].post.main 
          : [userPosts[accountId].post.main];

        posts.forEach(postJson => {
          try {
            const postData = JSON.parse(postJson);
            if (postData.type === 'deepfake_detection') {
              detectionPosts.push({
                accountId: accountId,
                ...postData
              });
            }
          } catch (parseError) {
            console.warn('⚠️ Failed to parse post');
          }
        });
      } catch (error) {
        console.warn('⚠️ Error processing user posts');
      }
    }

    return {
      success: true,
      posts: detectionPosts,
      accountId: accountId
    };

  } catch (error) {
    console.error('❌ Failed to get user detection history:', error);
    return {
      success: false,
      error: error.message,
      posts: []
    };
  }
}

// Like a detection post
export async function likeDetectionPost(postAccountId, postTimestamp) {
  // Check if we should use mock mode
  if (shouldUseMock) {
    return await mockLikeDetectionPost(postAccountId, postTimestamp);
  }

  try {
    const signedIn = await isSignedIn();
    if (!signedIn) {
      throw new Error('Please connect your NEAR wallet first');
    }

    const accountId = await getAccountId();
    const contract = await getSocialContract();

    const likeData = {
      [accountId]: {
        index: {
          like: JSON.stringify({
            key: `${postAccountId}/post/main@${postTimestamp}`,
            value: {
              type: 'like'
            }
          })
        }
      }
    };

    console.log('👍 Liking detection post...', { postAccountId, postTimestamp });

    const result = await contract.set({
      data: likeData
    }, '300000000000000', '10000000000000000000000'); // 0.01 NEAR deposit

    console.log('✅ Successfully liked post');

    return {
      success: true,
      transactionHash: result.transaction?.hash
    };

  } catch (error) {
    console.error('❌ Failed to like post:', error);
    
    // If social contract isn't available, fall back to mock mode
    if (error.message.includes('not available') || error.message.includes('does not exist')) {
      console.log('📝 Falling back to mock social contract for testing');
      shouldUseMock = true;
      return await mockLikeDetectionPost(postAccountId, postTimestamp);
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Get statistics about community detection activity
export async function getCommunityStats() {
  // Check if we should use mock mode
  if (shouldUseMock) {
    return await mockGetCommunityStats();
  }

  try {
    const feed = await getCommunityFeed(100); // Get more posts for stats
    
    if (!feed.success) {
      throw new Error(feed.error);
    }

    const posts = feed.posts;
    const totalPosts = posts.length;
    const deepfakePosts = posts.filter(post => post.result?.isDeepfake).length;
    const authenticPosts = totalPosts - deepfakePosts;

    // Calculate average confidence
    const avgConfidence = posts.length > 0 
      ? posts.reduce((sum, post) => sum + (post.result?.confidence || 0), 0) / posts.length
      : 0;

    // Get unique contributors
    const contributors = new Set(posts.map(post => post.accountId));

    // Get posts from last 24 hours
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentPosts = posts.filter(post => 
      post.metadata?.timestamp && post.metadata.timestamp > oneDayAgo
    );

    return {
      success: true,
      stats: {
        totalDetections: totalPosts,
        deepfakeDetections: deepfakePosts,
        authenticDetections: authenticPosts,
        averageConfidence: Math.round(avgConfidence),
        uniqueContributors: contributors.size,
        postsLast24h: recentPosts.length,
        deepfakeRate: totalPosts > 0 ? Math.round((deepfakePosts / totalPosts) * 100) : 0
      }
    };

  } catch (error) {
    console.error('❌ Failed to get community stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Utility function to format detection posts for display
export function formatDetectionPost(post) {
  return {
    id: `${post.accountId}_${post.metadata?.timestamp}`,
    author: post.accountId,
    message: post.message,
    isDeepfake: post.result?.isDeepfake || false,
    confidence: post.result?.confidence || 0,
    teeVerified: post.result?.teeVerified || false,
    timestamp: post.metadata?.timestamp,
    timeAgo: post.metadata?.timestamp ? getTimeAgo(post.metadata.timestamp) : 'Unknown',
    socialUrl: post.socialUrl
  };
}

// Helper function to get "time ago" string
function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

// Export all functions
export {
  getSocialContract
}; 