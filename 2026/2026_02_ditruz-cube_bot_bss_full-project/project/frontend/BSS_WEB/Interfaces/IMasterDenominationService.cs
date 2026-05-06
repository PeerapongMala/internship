using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterDenominationService
    {
        Task<MasterDenominationListResult> GetAllMasterDenominationAsyn();
        Task<MasterDenominationResult> GetDenominationByIdAsync(int Id);
        Task<BaseServiceResult> UpdateDenominationAsync(UpdateDenominationRequest request);
        Task<BaseServiceResult> DeleteDenominationAsync(int Id);
        Task<BaseServiceResult> CreateDenominationAsync(CreateDenominationRequest request);
        Task<MasterDenominationPageResult> SearchDenominationAsync(PagedRequest<MasterDenominationRequest> request);
    }
}
