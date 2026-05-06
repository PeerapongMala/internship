using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IBssAuthorizationService
    {
        Task<UserAuthorizationData> CheckUserAuthorizationAsync(string usernameId);
        Task<UserAuthorizationData> GetUserInformationDataAsync(string usernameId);
        Task<UserSessionLoginData> CheckUserSessionLoginActiveAsync(string usernameId);
        Task<UserSessionLoginData?> CheckUserSessionByMachineAsync(CheckUserSessionByMachineActiveRequest request);
    }
}
