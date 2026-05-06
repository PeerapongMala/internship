using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterSeriesDenomRepository : IGenericRepository<MasterSeriesDenom>
    {
        public Task<PagedData<MasterSeriesDenom>> SearchMasterSeriesDenom(
           PagedRequest<MasterSeriesDenomRequest> request,
           CancellationToken ct = default);
    }
}
