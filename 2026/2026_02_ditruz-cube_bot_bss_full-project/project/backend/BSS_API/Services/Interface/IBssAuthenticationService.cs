using BSS_API.Models.ServiceModels;

namespace BSS_API.Services.Interface
{
    public interface IBssAuthenticationService
    {
        Task<GetUserByLogonNameResult> GetUserByLogonName(string logonName);
        Task<GetUsersByGuidResult> GetUsersByGuid(string guid);
        Task<GetAllInOUAccountByDisplayNamesResult> GetAllInOUAccountByDisplayNames(string displayNames);
        Task<GetActivePersonByCertResult> GetActivePersonByCert(string sCertificate);
        Task<GetPersonListBySearchNameResult> GetPersonListBySearchName(string partialName, string organizationID);
    }
}
