using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCashCenterService
    {
        Task<MasterCashCenterListResult> GetCashCenterAllAsync();
        Task<MasterCashCenterResult> GetCashCenterByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCashCenterAsync(MasterCashCenterDisplay request);
        Task<BaseServiceResult> CreateCashCenterAsync(MasterCashCenterDisplay request);
        Task<BaseServiceResult> DeleteCashCenterAsync(int Id);
        Task<MasterCashCenterListResult> GetCashCenterByFilterAsync(CashCenterFilterSearch request);
        Task<MasterCashCenterPageResult> SearchMasterCashCenterAsync(PagedRequest<MasterCashCenterRequest> request);
    }
}
