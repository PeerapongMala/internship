using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterMSevendenomSeriesService
    {
        Task<IEnumerable<MasterMSevendenomSeries>> GetAllMSevendenomSeries();
        Task<MasterMSevendenomSeriesViewData> GetMSevendenomSeriesById(int Id);
        Task<IEnumerable<MasterMSevendenomSeries>> GetMSevendenomSeriesByUniqueOrKey(int mSevenDenomId, int seriesDenomId);
        Task CreateMSevendenomSeries(CreateMSevendenomSeries request);
        Task UpdateMSevendenomSeries(UpdateMSevendenomSeries request);
        Task DeleteMSevendenomSeries(int Id);
        Task<PagedData<MasterMSevendenomSeriesViewData>> SearchMSevendenomSeries(PagedRequest<MasterMSevendenomSeriesRequest> request);


    }
}
