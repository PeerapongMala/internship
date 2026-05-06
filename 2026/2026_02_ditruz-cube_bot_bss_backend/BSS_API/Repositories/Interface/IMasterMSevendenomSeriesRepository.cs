using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterMSevendenomSeriesRepository : IGenericRepository<MasterMSevendenomSeries>
    {
        Task<PagedData<MasterMSevendenomSeries>> SearchMasterMSevendenomSeries(
           PagedRequest<MasterMSevendenomSeriesRequest> request,
           CancellationToken ct = default);
    }
}
