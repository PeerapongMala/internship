namespace BSS_API.Repositories.Interface
{
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface IAutoSellingRepository
    {
        Task<AutoSellingAllDataResponse> GetAllDataAsync(AutoSellingFilterRequest filter, CancellationToken ct = default);

        Task<AutoSellingDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default);

        Task<bool> SaveAdjustmentAsync(AutoSellingAdjustmentRequest request, CancellationToken ct = default);

        Task<bool> CancelSendAsync(AutoSellingCancelSendRequest request, CancellationToken ct = default);

        Task<bool> SaveInsertReplaceAsync(AutoSellingInsertReplaceRequest request, CancellationToken ct = default);

        Task<bool> SaveAdjustOffsetAsync(AdjustOffsetRequest request, CancellationToken ct = default);

        Task<bool> ChangeShiftAsync(AutoSellingChangeShiftRequest request, CancellationToken ct = default);
    }
}
