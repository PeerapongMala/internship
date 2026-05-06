using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterCompanyInstitutionRepository : IGenericRepository<MasterCompanyInstitution>
    {
        Task<MasterCompanyInstitution?> GetByInstitutionByInstIdAsync(int companyId, int InstId);
        Task<PagedData<MasterCompanyInstitution>> SearchMasterCompanyInstitution(
       PagedRequest<MasterCompanyInstitutionRequest> request,
       CancellationToken ct = default);
    }
}
