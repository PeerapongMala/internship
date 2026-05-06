namespace BSS_API.Services.Interface
{
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface IAutoSellingService
    {
        Task<AutoSellingAllDataResponse> GetAllDataAsync(AutoSellingFilterRequest filter, CancellationToken ct = default);

        Task<AutoSellingDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default);

        Task<AutoSellingActionResponse> SaveAdjustmentAsync(AutoSellingAdjustmentRequest request);

        Task<AutoSellingActionResponse> MergeBundlesAsync(AutoSellingMergeRequest request);

        Task<AutoSellingValidateSummaryResponse> ValidateSummaryAsync(AutoSellingValidateSummaryRequest request);

        Task<AutoSellingActionResponse> CancelSendAsync(AutoSellingCancelSendRequest request);

        Task<AutoSellingActionResponse> ChangeShiftAsync(AutoSellingChangeShiftRequest request);

        Task<AutoSellingActionResponse> SaveInsertReplaceAsync(AutoSellingInsertReplaceRequest request);

        Task<AutoSellingActionResponse> SaveAdjustOffsetAsync(AdjustOffsetRequest request);
    }
}
