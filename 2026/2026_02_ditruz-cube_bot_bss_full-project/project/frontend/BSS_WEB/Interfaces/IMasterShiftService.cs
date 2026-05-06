using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterShiftService
    {
        Task<MasterShiftListResult> GetAllMasterShiftAsyn();
        Task<MasterShiftResult> GetShiftByIdAsync(int Id);
        Task<BaseServiceResult> UpdateShiftAsync(UpdateShiftRequest request);
        Task<BaseServiceResult> DeleteShiftAsync(int Id);
        Task<BaseServiceResult> CreateShiftAsync(CreateShiftRequest request);
        Task<GetShiftActiveResult> GetShiftActiveAsync();
        Task<MasterShiftPageResult> SearchShiftAsync(PagedRequest<MasterShiftRequest> request);
        Task<GetCurrentShiftResult> GetCurrentShiftAsync();
    }
}
