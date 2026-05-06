using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using System.Security.Claims;

namespace BSS_WEB.Interfaces
{
    public interface IBssAuthenticationService
    {
        Task<CheckUserAuthorizationResult> CheckUserAuthorizationAsyn(string usernameId);
        Task<UserInternalAuthenResult> UserInternalAuthenAsyn(string logonName);
        Task<UserExternalAuthenResult> UserExternalAuthenAsyn(string sCertificate);
        Task<SearchUserForRegisterResult> SearchUserForRegisterAsync(SearchUserForCreateRequest request);
        Task<UpdateUserOperationSettingResult> UpdateUserOperationSettingAsync(SaveOperationSettingRequest request);
        Task<UpdateUserOperationSettingResult> UpdateUserVerifySettingAsync(SaveVerifySettingRequest request);
        Task<BaseServiceResult> UserLogoutAsync(UserLogoutRequest request);
        Task<GetSorterUsersResult> GetSorterUsersAsync(GetSorterUsersRequest request);
        Task<string> GenerateAccessTokenJwt(UserAccessData user);
        Task<string> GenerateRefreshToken();
        Task<string> HashRefreshToken(string refreshToken);
        Task<GetUserInformationDataResult> GetUserInformationDataAsync(string usernameId);
        Task<RefreshTokenServiceResult> CreateRefreshTokenAsync(CreateRefreshTokenRequest request);
        Task<RefreshTokenServiceResult> RefreshTokenAndRotationAsync(RefreshTokenAndNewGenerateRequest request);
        Task<RefreshTokenServiceResult> LogoutAndRevoke(LogoutAndRevokeRequest request);
        Task<CheckUserSessionLoginActiveResult> CheckUserSessionLoginActiveAsyn(string usernameId);
        Task<GetUserLoginDropdownResult> GetUserLoginDropdownAsync();
        Task<CheckUserSessionLoginActiveResult> CheckUserSessionByMachineAsync(CheckUserSessionByMachineActiveRequest request);

    }
}
