import { useState, useEffect } from 'react';
import { 
  getCommunityFeed, 
  getCommunityStats, 
  getUserDetectionHistory,
  likeDetectionPost,
  formatDetectionPost 
} from '../utils/near-social';
import { useNEARWallet } from './NEARWalletConnect';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, deepfake, authentic
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, confidence
  const [searchTerm, setSearchTerm] = useState('');
  const nearWallet = useNEARWallet();

  // Load community feed and stats
  const loadCommunityData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Loading community feed...');
      
      const [feedResult, statsResult] = await Promise.all([
        getCommunityFeed(100),
        getCommunityStats()
      ]);

      if (feedResult.success) {
        const formattedPosts = feedResult.posts.map(formatDetectionPost);
        setPosts(formattedPosts);
        console.log(`✅ Loaded ${formattedPosts.length} community posts`);
      } else {
        throw new Error(feedResult.error || 'Failed to load community feed');
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
        console.log('✅ Loaded community stats:', statsResult.stats);
      }

    } catch (error) {
      console.error('❌ Failed to load community data:', error);
      
      // Check if it's a gas limit issue
      if (error.message.includes('GasLimitExceeded') || error.message.includes('gas')) {
        setError('NEAR Social testnet query exceeded gas limits. Using sample data to demonstrate features. Will retry real contract on next refresh.');
      }
      // Check if it's a contract availability issue
      else if (error.message.includes('not available') || error.message.includes('does not exist')) {
        setError('NEAR Social testnet contract not available. Using sample data for testing.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunityData();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      // Filter by type
      if (filter === 'deepfake' && !post.isDeepfake) return false;
      if (filter === 'authentic' && post.isDeepfake) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          post.message.toLowerCase().includes(searchLower) ||
          post.author.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return (a.timestamp || 0) - (b.timestamp || 0);
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0);
        case 'newest':
        default:
          return (b.timestamp || 0) - (a.timestamp || 0);
      }
    });

  const handleLike = async (post) => {
    if (!nearWallet.connected) {
      alert('Please connect your NEAR wallet to like posts');
      return;
    }

    try {
      console.log('👍 Liking post...', post.id);
      const result = await likeDetectionPost(post.author, post.timestamp);
      
      if (result.success) {
        console.log('✅ Successfully liked post');
        // You could update local state here to show the like immediately
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Failed to like post:', error);
      alert('Failed to like post: ' + error.message);
    }
  };

  const PostCard = ({ post }) => (
    <div className="border border-gray-700 bg-gray-900/50 p-4 rounded-lg">
      {/* Post header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {post.author.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-300">
              {post.author.length > 20 
                ? `${post.author.substring(0, 8)}...${post.author.substring(post.author.length - 8)}`
                : post.author
              }
            </p>
            <p className="text-xs text-gray-500">{post.timeAgo}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mock mode indicator */}
          {post.mockMode && (
            <div className="px-2 py-1 rounded text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-700">
              Test
            </div>
          )}
          
          {/* Detection result badge */}
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            post.isDeepfake 
              ? 'bg-red-900/30 text-red-400 border border-red-700' 
              : 'bg-green-900/30 text-green-400 border border-green-700'
          }`}>
            {post.isDeepfake ? '🚨 Deepfake' : '✅ Authentic'}
          </div>
        </div>
      </div>

      {/* Post message */}
      <p className="text-gray-300 text-sm mb-3">{post.message}</p>

      {/* Detection details */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-xs">
        <div>
          <span className="text-gray-500">Confidence</span>
          <p className="text-white font-mono">{post.confidence}%</p>
        </div>
        <div>
          <span className="text-gray-500">TEE Verified</span>
          <p className={post.teeVerified ? 'text-green-400' : 'text-yellow-400'}>
            {post.teeVerified ? 'Yes' : 'Fallback'}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Model</span>
          <p className="text-gray-400">v1.0</p>
        </div>
      </div>

      {/* Post actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleLike(post)}
            disabled={!nearWallet.connected}
            className={`flex items-center gap-1 text-xs transition-colors ${
              nearWallet.connected 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
            </svg>
            Like
          </button>
          
          {post.socialUrl ? (
            <a
              href={post.socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
              </svg>
              View on NEAR Social
            </a>
          ) : (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"/>
              </svg>
              Test Data
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="community-feed text-center py-12">
        <div className="w-12 h-12 mx-auto border border-gray-600 rounded-full animate-spin border-t-white mb-4"></div>
        <p className="text-gray-400">Loading community feed...</p>
      </div>
    );
  }

  if (error) {
    // Check if it's a gas limit error (which means we're using mock data)
    const isGasLimitError = error.includes('gas') || error.includes('GasLimitExceeded');
    
    if (isGasLimitError) {
      return (
        <div className="community-feed">
          <div className="mb-8 border border-yellow-700 bg-yellow-900/20 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <h3 className="text-lg font-medium text-yellow-400">Using Test Data</h3>
            </div>
            <p className="text-yellow-300 mb-4">
              Attempted to connect to NEAR Social testnet (v1.social08.testnet) but queries exceeded gas limits. Showing sample data to demonstrate features.
            </p>
            <p className="text-yellow-600 text-sm mb-4">
              The app will retry the real testnet contract on each refresh. This fallback ensures you can test all features.
            </p>
            <button
              onClick={loadCommunityData}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors text-sm"
            >
              Try Real Data Again
            </button>
          </div>
          
          {/* Load the community data anyway (will use mock) */}
          <div className="space-y-4">
            {filteredAndSortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="community-feed text-center py-12">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <p>Failed to load community feed</p>
          </div>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={loadCommunityData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
  }

  return (
    <div className="community-feed">
      {/* Community stats */}
      {stats && (
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-white">{stats.totalDetections}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Total Detections</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-red-400">{stats.deepfakeDetections}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Deepfakes Found</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-blue-400">{stats.uniqueContributors}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Contributors</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-lg text-center">
            <div className="text-2xl font-mono text-green-400">{stats.postsLast24h}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">Last 24h</div>
          </div>
        </div>
      )}

      {/* Filters and search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter:</span>
            {['all', 'deepfake', 'authentic'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded border-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence">Highest Confidence</option>
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={loadCommunityData}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts or authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-500"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {/* Posts */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            {searchTerm || filter !== 'all' 
              ? 'No posts match your filters' 
              : 'No community posts yet'
            }
          </div>
          {posts.length === 0 && (
            <p className="text-gray-600 text-sm">
              Be the first to share a detection result with the community!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-4">
            Showing {filteredAndSortedPosts.length} of {posts.length} posts
          </p>
          {filteredAndSortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
} 