using BSS_API.Models.ObjectModels;

namespace BSS_API.Services.Interface
{
    public interface IBssAuthorizationService
    {
        Task<UserAuthorizationData> CheckUserAuthorizationAsync(string usernameId);
        Task<UserAuthorizationData> GetUserInformationDataAsync(string usernameId);
    }
}
