using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterM7DenominationService
    {
        Task<MasterM7DenominationListResult> GetM7DenominationsAllAsync();
        Task<MasterM7DenominationResult> GetM7DenominationsByIdAsync(int Id);
        Task<BaseServiceResult> CreateM7DenominationAsync(CreateM7DenominationRequest request);
        Task<BaseServiceResult> UpdateM7DenominationAsync(UpdateM7DenominationRequest request);
        Task<BaseServiceResult> DeleteM7DenominationAsync(int Id);
        Task<MasterM7DenominationListResult> GetM7DenominationByFilterAsync(M7DenominationFilterSearch request);
        Task<MasterM7DenominationPageResult> SearchM7DenominationAsync(PagedRequest<MasterM7DenominationRequest> request);
    }
}
