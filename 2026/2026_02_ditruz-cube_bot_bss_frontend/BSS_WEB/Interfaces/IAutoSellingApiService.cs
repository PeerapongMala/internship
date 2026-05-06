using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.AutoSelling;

namespace BSS_WEB.Interfaces
{
    public interface IAutoSellingApiService
    {
        Task<BaseApiResponse<AutoSellingAllDataResult>> GetAllDataAsync(AutoSellingFilterRequest filter);

        Task<BaseApiResponse<AutoSellingDetailResult>> GetDetailAsync(string headerCardCode);

        Task<BaseApiResponse<AutoSellingActionResult>> SaveAdjustmentAsync(AutoSellingAdjustmentRequest request);

        Task<BaseApiResponse<AutoSellingActionResult>> MergeBundlesAsync(AutoSellingMergeRequest request);

        Task<BaseApiResponse<AutoSellingValidateSummaryResult>> ValidateSummaryAsync(AutoSellingValidateSummaryRequest request);

        Task<BaseApiResponse<AutoSellingActionResult>> CancelSendAsync(AutoSellingCancelSendRequest request);

        Task<BaseApiResponse<AutoSellingActionResult>> ChangeShiftAsync(AutoSellingChangeShiftRequest request);

        Task<BaseApiResponse<AutoSellingActionResult>> SaveInsertReplaceAsync(AutoSellingInsertReplaceRequest request);

        Task<BaseApiResponse<AutoSellingActionResult>> SaveAdjustOffsetAsync(AdjustOffsetRequest request);
    }
}
