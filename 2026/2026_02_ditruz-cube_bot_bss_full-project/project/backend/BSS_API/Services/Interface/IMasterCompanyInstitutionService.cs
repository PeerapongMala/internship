using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterCompanyInstitutionService
    {
        Task<IEnumerable<MasterCompanyInstitution>> GetAllCompanyInstitution();
        Task<MasterCompanyInstitutionViewData> GetCompanyInstitutionById(int Id);
        Task<IEnumerable<MasterCompanyInstitution>> GetCompanyInstitutionByUniqueOrKey(int companyId, int instId);
        Task CreateCompanyInstitution(CreateMasterCompanyInstitution request);
        Task UpdateCompanyInstitution(UpdateCompanyInstitution request);
        Task DeleteCompanyInstitution(int Id);
        Task<PagedData<MasterCompanyInstitutionViewData>> SearchCompanyInstitution(PagedRequest<MasterCompanyInstitutionRequest> request);
    }
}
