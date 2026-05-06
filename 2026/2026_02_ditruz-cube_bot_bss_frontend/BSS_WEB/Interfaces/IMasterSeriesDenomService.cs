using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterSeriesDenomService
    {
        Task<MasterSeriesDenomListResult> GetAllMasterSeriesDenomAsync();
        Task<MasterSeriesDenomResult> GetSeriesDenomByIdAsync(int Id);
        Task<BaseServiceResult> UpdateSeriesDenomAsync(UpdateSeriesDenomRequest request);
        
        Task<BaseServiceResult> CreateSeriesDenomAsync(CreateSeriesDenomRequest request);
        
        Task<MasterSeriesDenomSearchResult> SearchSeriesDenomAsync(PagedRequest<MasterSeriesDenomRequest> request);
    }
}
