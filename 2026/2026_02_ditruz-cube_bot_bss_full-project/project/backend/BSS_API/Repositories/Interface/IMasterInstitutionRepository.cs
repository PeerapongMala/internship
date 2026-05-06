using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterInstitutionRepository : IGenericRepository<MasterInstitution>
    {
        Task<MasterInstitution?> GetMasterInstitutionByCodeAsync(string institutionCode);
        Task<MasterInstitution?> GetMasterInstitutionByInstIdAsync(int institutionId);
        Task<ICollection<MasterInstitution>> GetMasterInstitutionWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterInstitution>> SearchMasterInstitution(
           PagedRequest<MasterInstitutionRequest> request,
           CancellationToken ct = default);
    }
}