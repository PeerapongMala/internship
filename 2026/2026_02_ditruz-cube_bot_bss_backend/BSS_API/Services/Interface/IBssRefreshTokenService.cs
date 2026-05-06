using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IBssRefreshTokenService
    {
        Task<IEnumerable<BssGenerateRefreshTokenResult>> GetRefreshTokenListByUserIdAsync(int userId);
        Task<BssGenerateRefreshTokenResult?> CreateRefreshTokenAsync(CreateRefreshTokenRequest request);
        Task<BssGenerateRefreshTokenResult?> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request);
        Task<BssGenerateRefreshTokenResult?> LogoutAndRevokeAsync(LogoutAndRevokeRequest request);
    }
}
