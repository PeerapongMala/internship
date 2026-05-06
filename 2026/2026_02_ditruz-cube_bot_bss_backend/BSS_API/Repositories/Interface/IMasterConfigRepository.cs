using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterConfigRepository : IGenericRepository<MasterConfig>
    {
        Task<List<MasterConfig>> GetAllAsync(CancellationToken ct = default);
        
        Task<List<MasterConfig>> GetByConfigTypeCodeAsync(string configTypeCode);
        
        Task<ICollection<MasterConfig>> GetMasterConfigWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterConfig>> SearchMasterConfig(
            PagedRequest<MasterConfigRequest> request,
            CancellationToken ct = default);
    }
}
