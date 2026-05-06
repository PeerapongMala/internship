using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterCashTypeRepository : IGenericRepository<MasterCashType>
    {
        Task<PagedData<MasterCashType>> SearchMasterCashType(
               PagedRequest<MasterCashTypeRequest> request,
               CancellationToken ct = default);
    }
}
