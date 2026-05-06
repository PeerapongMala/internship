using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterSeriesDenomService
    {
        Task<IEnumerable<MasterSeriesDenom>> GetAllSeriesDenom();
        Task<MasterSeriesDenomViewData> GetMasterSeriesDenomById(int Id);
        Task<IEnumerable<MasterSeriesDenom>> GetSeriesDenomByUniqueOrKey(string seriesCode);
        Task CreateSeriesDenom(CreateSeriesDenom requst);
        Task UpdateSeriesDenom(UpdateSeriesDenom request);
        Task DeleteSeriesDenom(int Id);
        Task<PagedData<MasterSeriesDenom>> SearchSeriesDenom(PagedRequest<MasterSeriesDenomRequest> request);


    }
}
