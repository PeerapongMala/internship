using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterBanknoteTypeSendService
    {
        Task<MasterBanknoteTypeSendListResult> GetAllBanknoteTypeSendAsyn();
        Task<MasterBanknoteTypeSendResult> GetBanknoteTypeSendByIdAsync(int Id);
        Task<BaseServiceResult> UpdateBanknoteTypeSendAsync(UpdateBanknoteTypeSendRequest request);
        Task<BaseServiceResult> DeleteBanknoteTypeSendAsync(int Id);
        Task<BaseServiceResult> CreateBanknoteTypeSendAsync(CreateBanknoteTypeSendRequest request);
        Task<MasterBanknoteTypeSendPagedResult> SearchBanknoteTypeSendAsync(PagedRequest<MasterBanknoteTypeSendRequest> request);
    }
}
