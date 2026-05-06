using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterDenomReconcileRepository : IGenericRepository<MasterDenomReconcile>
    {
        Task<PagedData<MasterDenomReconcile>> SearchMasterDenomReconcile(
           PagedRequest<MasterDenomReconcileRequest> request,
           CancellationToken ct = default);
    }
}