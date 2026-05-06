using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterStatusService
    {
        Task<MasterStatusListResult> GetStatusAllAsync();
        Task<GetStatusByIdResult> GetStatusByIdAsync(int Id);
        Task<BaseServiceResult> UpdateStatusAsync(UpdateStatusRequest request);
        Task<BaseServiceResult> CreateStatusAsync(CreateStatusRequest request);
        Task<BaseServiceResult> DeleteStatusAsync(int Id);
        Task<MasterStatusPageResult> SearchStatusAsync(PagedRequest<MasterStatusRequest> request);
    }
}
