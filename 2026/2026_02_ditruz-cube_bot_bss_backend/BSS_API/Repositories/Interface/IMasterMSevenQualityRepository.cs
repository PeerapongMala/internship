using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterMSevenQualityRepository : IGenericRepository<MasterMSevenQuality>
    {
        Task<PagedData<MasterMSevenQuality>> SearchMasterMSevenQuality(
          PagedRequest<MasterMSevenQualityRequest> request,
          CancellationToken ct = default);
    }
}
