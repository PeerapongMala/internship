using BSS_API.Helpers;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using System.Collections.Concurrent;

namespace BSS_API.Services
{
    public class SessionManagementService : ISessionManagementServic
    {
        private readonly IMemoryCache _cache;
        private readonly IUnitOfWork _unitOfWork;
        private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();
        public SessionManagementService(IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _unitOfWork = unitOfWork;
            _cache = cache;
        }
        public async Task<string?> GetSessionTokenVersion(string userId)
        {
            var hotKey = $"session_hot_{userId}";
            var warmKey = $"session_warm_{userId}";

            // HOT CACHE
            if (_cache.TryGetValue(hotKey, out string? hotValue))
                return hotValue;

            //WARM CACHE
            if (_cache.TryGetValue(warmKey, out string? warmValue))
            {
                // refill hot cache
                _cache.Set(hotKey, warmValue, TimeSpan.FromSeconds(10));
                return warmValue;
            }

            //LOCK PER USER
            var myLock = _locks.GetOrAdd(userId, _ => new SemaphoreSlim(1, 1));

            await myLock.WaitAsync();

            try
            {
                // double check warm cache
                if (_cache.TryGetValue(warmKey, out warmValue))
                {
                    _cache.Set(hotKey, warmValue, TimeSpan.FromSeconds(10));
                    return warmValue;
                }

                //DATABASE
                var versionToken = await _unitOfWork.BssRefreshTokenRepos.GetFirstOrDefaultAsync(x => x.UserId == userId.AsInt());

                var versionTokenText = JsonConvert.SerializeObject(versionToken);

                // set warm cache
                _cache.Set(warmKey, versionTokenText, TimeSpan.FromMinutes(2));

                // set hot cache
                _cache.Set(hotKey, versionTokenText, TimeSpan.FromSeconds(10));

                return versionTokenText;
            }
            finally
            {
                myLock.Release();
            }
        }
    }
}
