using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Spreadsheet;

namespace BSS_API.Services
{
    public class BssRefreshTokenService : IBssRefreshTokenService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BssRefreshTokenService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BssGenerateRefreshTokenResult?> CreateRefreshTokenAsync(CreateRefreshTokenRequest request)
        {
            return await _unitOfWork.BssRefreshTokenRepos.CreateRefreshTokenAsync(request);
        }

        public async Task<BssGenerateRefreshTokenResult?> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request)
        {
            return await _unitOfWork.BssRefreshTokenRepos.RefreshTokenAndRotationAsync(request);
        }

        public async Task<BssGenerateRefreshTokenResult?> LogoutAndRevokeAsync(LogoutAndRevokeRequest request)
        {
            return await _unitOfWork.BssRefreshTokenRepos.LogoutAndRevokeAsync(request);
        }

        public async Task<IEnumerable<BssGenerateRefreshTokenResult>> GetRefreshTokenListByUserIdAsync(int userId)
        {
            return await _unitOfWork.BssRefreshTokenRepos.GetRefreshTokenListByUserIdAsync(userId);
        }

        public async Task<BssGenerateRefreshTokenResult?> GetLastRefreshTokenByUserIdAsync(int userId)
        {
            return await _unitOfWork.BssRefreshTokenRepos.GetLastRefreshTokenByUserIdAsync(userId);
        }

    }
}
