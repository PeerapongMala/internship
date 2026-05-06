using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterCashCenterRepository : IGenericRepository<MasterCashCenter>
    {
        void Update(MasterCashCenter entity);
        
        Task<ICollection<MasterCashCenter>> GetMasterCashCenterWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterCashCenter>> SearchCashCenter(
           PagedRequest<MasterCashCenterRequest> request,
           CancellationToken ct = default);
    }
}
