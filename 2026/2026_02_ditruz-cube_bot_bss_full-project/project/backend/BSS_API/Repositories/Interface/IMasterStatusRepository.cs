using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterStatusRepository : IGenericRepository<MasterStatus>
    {
        Task<PagedData<MasterStatus>> SearchMasterStatus(
           PagedRequest<MasterStatusRequest> request,
           CancellationToken ct = default);
    }
}
