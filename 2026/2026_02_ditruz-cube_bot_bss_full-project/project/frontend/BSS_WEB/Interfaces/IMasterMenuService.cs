using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterMenuService
    {
        Task<MasterMenuListResult> GetAllMasterMenuAsyn();
        Task<MasterMenuResult> GetMenuByIdAsync(int Id);
        Task<BaseServiceResult> UpdateMenuAsync(UpdateMenuRequest request);
        Task<BaseServiceResult> DeleteMenuAsync(int Id);
        Task<BaseServiceResult> CreateMenuAsync(CreateMenuRequest request);
        Task<MasterMenuActiveListResult> GetMasterMenuActiveAsyn();
        Task<MasterMenuPageResult> SearchMenuAsync(DataTablePagedRequest<MasterMenuRequest> request);
    }
}
