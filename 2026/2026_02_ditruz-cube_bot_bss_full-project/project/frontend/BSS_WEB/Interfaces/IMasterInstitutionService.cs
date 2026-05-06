using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterInstitutionService
    {
        Task<MasterInstitutionListResult> GetInstitutionsAllAsync();
        Task<MasterInstitutionResult> GetInstitutionByIdAsync(int id);
        Task<BaseServiceResult> UpdateInstitutionAsync(UpdateInstitutionRequest request);
        Task<BaseServiceResult> CreateInstitutionAsync(CreateInstitutionRequest request);
        Task<BaseServiceResult> DeleteInstitutionAsync(int id);
        Task<MasterInstitutionPageResult> SearchInstitutionAsync(PagedRequest<MasterInstitutionRequest> request);
    }
}
