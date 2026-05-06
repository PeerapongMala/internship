using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IBssRefreshTokenRepository: IGenericRepository<BssTransactionRefreshToken>
    {
        Task<IEnumerable<BssGenerateRefreshTokenResult>> GetRefreshTokenListByUserIdAsync(int userId);
        Task<BssGenerateRefreshTokenResult?> GetLastRefreshTokenByUserIdAsync(int userId);
        Task<BssGenerateRefreshTokenResult?> CreateRefreshTokenAsync(CreateRefreshTokenRequest request);
        Task<BssGenerateRefreshTokenResult?> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request);
        Task<BssGenerateRefreshTokenResult?> LogoutAndRevokeAsync(LogoutAndRevokeRequest request);
    }
}
