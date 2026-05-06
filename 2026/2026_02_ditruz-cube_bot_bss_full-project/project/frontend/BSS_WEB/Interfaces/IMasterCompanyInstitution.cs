using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCompanyInstitutionService
    {
       
        Task<MasterCompanyInstitutionResult> GetCompanyInstitutionByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCompanyInstitutionAsync(UpdateCompanyInstitutionRequest request); 
        Task<BaseServiceResult> CreateCompanyInstitutionAsync(CreateCompanyInstitutionRequest request);
        Task<MasterCompanyInstitutionPageResult> SearchMasterCompanyInstitutionAsync(PagedRequest<MasterCompanyInstitutionRequest> request);
        
    }
}
