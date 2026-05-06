using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCashPointService
    {
        Task<MasterCashPointListResult> GetCashPointAllAsync();
        Task<MasterCashPointResult> GetCashPointByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCashPointAsync(UpdateCashPointRequest request);
        Task<BaseServiceResult> CreateCashPointAsync(CreateCashPointRequest request);
        Task<BaseServiceResult> DeleteCashPointAsync(int Id);
        Task<MasterCashPointListResult> GetCashPointByFilterAsync(CashPointFilterSearch request);
        Task<MasterCashPointPageResult> SearchCashPointAsync(PagedRequest<MasterCashPointRequest> request);
    }
}
