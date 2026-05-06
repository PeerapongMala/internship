namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionApproveManualKeyInTranService
    {
        Task<PagedData<ApproveManualKeyInTransactionResponse>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request, CancellationToken ct = default);

        Task<ApproveManualKeyInHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long approveManualKeyInTranId);

        Task<EditApproveManualKeyInTranResponse> EditApproveManualKeyInTranAsync(EditApproveManualKeyInTranRequest request);

        Task<DeleteApproveManualKeyInTranResponse> DeleteApproveManualKeyInTranAsync(DeleteApproveManualKeyInTranRequest request);

        Task<ApproveManualKeyInDetailResponse?> GetApproveManualKeyInDetailAsync(long approveManualKeyInTranId);

        Task<ApproveManualKeyInScanResponse> ApproveAsync(ApproveManualKeyInActionRequest request);

        Task<ApproveManualKeyInScanResponse> DenyAsync(CancelApproveManualKeyInRequest request);

        Task<ApproveManualKeyInCountResponse> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request);
    }
}
