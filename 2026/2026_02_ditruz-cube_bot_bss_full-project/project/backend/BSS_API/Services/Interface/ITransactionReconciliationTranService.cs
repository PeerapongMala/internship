namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionReconciliationTranService
    {
        Task<PagedData<ReconciliationTransactionResponse>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request, CancellationToken ct = default);

        Task<ReconciliationScanResponse> ScanHeaderCardAsync(ReconciliationScanRequest request);

        Task<ReconciliationHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconsileTranId);

        Task<EditReconciliationTranResponse> EditReconciliationTranAsync(EditReconciliationTranRequest request);

        Task<DeleteReconciliationTranResponse> DeleteReconciliationTranAsync(DeleteReconciliationTranRequest request);

        Task<ReconciliationDetailResponse?> GetReconciliationDetailAsync(long reconsileTranId);

        Task<ReconciliationScanResponse> ReconciliationAsync(ReconciliationActionRequest request);

        Task<ReconciliationScanResponse> CancelReconciliationAsync(CancelReconciliationRequest request);

        Task<ReconciliationCountResponse> GetReconciliationCountAsync(ReconciliationCountRequest request);

        Task<object> CheckChildHeaderCardAsync(string headerCardCode);
    }
}
