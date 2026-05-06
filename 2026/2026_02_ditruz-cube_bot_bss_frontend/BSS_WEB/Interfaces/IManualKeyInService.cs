using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.ManualKeyIn;

namespace BSS_WEB.Interfaces
{
    public interface IManualKeyInService
    {
        Task<BaseApiResponse<ManualKeyInHeaderCardInfoResult>> GetHeaderCardInfoAsync(string headerCardCode);
        Task<BaseApiResponse<ManualKeyInDenominationResult>> GetDenominationsAsync(long prepareId);
        Task<BaseApiResponse<ManualKeyInSaveResult>> SaveAsync(ManualKeyInSaveRequest request);
        Task<BaseApiResponse<ManualKeyInSaveResult>> SubmitForApprovalAsync(ManualKeyInSubmitRequest request);
    }
}
