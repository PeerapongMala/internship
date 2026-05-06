using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterM7DenomSeriesService
    {
        
        Task<MasterM7DenomSeriesResult> GetM7DenomSeriesByIdAsync(int Id);
        Task<BaseServiceResult> UpdateM7DenomSeriesAsync(UpdateM7DenomSeriesRequest request);
        Task<BaseServiceResult> CreateM7DenomSeriesAsync(CreateM7DenomSeriesRequest request);
        Task<BaseServiceResult> DeleteM7DenomSeriesAsync(int Id); 
        Task<MasterM7DenomSeriesPageResult> SearchM7DenomSeriesAsync(PagedRequest<MasterM7DenomSeriesRequest> request);
    }
}
