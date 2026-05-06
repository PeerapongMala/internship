using Microsoft.Extensions.Caching.Memory;
 
namespace BSS_API.Helpers
{
    public static class CacheHelper
    {
        private class CacheMeta
        {
            public string CacheKey { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; }
            public DateTime ExpirationTime { get; set; }
        }

        private static readonly Dictionary<string, CacheMeta> _keyTracker = new();
        private static IMemoryCache _cache;
        private static Serilog.ILogger _logger;
        public static void Initialize(IMemoryCache cache, Serilog.ILogger logger)
        {
            _cache = cache; 
            _logger = logger;
        }

        /// <summary>
        /// Get or set cache specific to a user.
        /// </summary>
        public static T GetOrSet<T>( 
            string userKey,
            string dataKey,
            Func<T> getData)
        {
            if (string.IsNullOrEmpty(userKey))
                throw new ArgumentNullException(nameof(userKey));
            if (string.IsNullOrEmpty(dataKey))
                throw new ArgumentNullException(nameof(dataKey));

            string cacheKey = $"{userKey}_{dataKey}".ToLowerInvariant();
            return GetOrSetInternal(cacheKey, dataKey, getData);
        }

        /// <summary>
        /// Get or set cache shared across all users (global cache).
        /// </summary>
        public static T GetOrSet<T>( 
            string dataKey,
            Func<T> getData)
        {
 
            if (string.IsNullOrEmpty(dataKey))
                throw new ArgumentNullException(nameof(dataKey));
            string cacheKey = $"GLOBAL_{dataKey}".ToLowerInvariant();
            return GetOrSetInternal(cacheKey, dataKey, getData);
        }

        /// <summary>
        /// Common logic for getting/setting cache entries.
        /// </summary>
        private static T GetOrSetInternal<T>(
            string cacheKey,
            string dataKey,
            Func<T> getData)
        {
            if (_cache.TryGetValue(cacheKey, out T cachedValue))
            {
                 
                return cachedValue;
            }

            int expirationMinutes = AppConfig.GetCacheExpirationMinute(dataKey);

            // Handle expiration == 0 => disable cache
            if (expirationMinutes <= 0)
            {
                return getData();
            }

            var data = getData();
            var expirationTime = DateTime.UtcNow.AddMinutes(expirationMinutes);

            _cache.Set(cacheKey, data, TimeSpan.FromMinutes(expirationMinutes));

            _keyTracker[cacheKey] = new CacheMeta
            {
                CacheKey = cacheKey,
                CreatedAt = DateTime.UtcNow,
                ExpirationTime = expirationTime
            };

            return data;
        }

        /// <summary>
        /// Removes cache by key and unregisters it from tracker.
        /// </summary>
        public static void Reset(IMemoryCache cache, string cacheKey)
        {
            cache.Remove(cacheKey);
            _keyTracker.Remove(cacheKey);
        }

        /// <summary>
        /// Returns all tracked cache keys with their expiration times.
        /// </summary>
        /// <summary>
        /// Returns metadata for all cached keys (cacheKey, createdAt, expirationTime).
        /// </summary>
        public static IReadOnlyList<object> GetCacheMetadata()
        {
            return _keyTracker.Values
                .Select(x => new
                {
                    cacheKey = x.CacheKey,
                    createdAt = x.CreatedAt,
                    expirationTime = x.ExpirationTime
                })
                .ToList();
        }
    }
}
