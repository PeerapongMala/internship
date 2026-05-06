namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionReconcileTranService
    {
        Task<PagedData<ReconcileTransactionResponse>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request, CancellationToken ct = default);

        Task<ReconcileScanResponse> ScanHeaderCardAsync(ReconcileScanRequest request);

        Task<ReconcileHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId);

        Task<EditReconcileTranResponse> EditReconcileTranAsync(EditReconcileTranRequest request);

        Task<DeleteReconcileTranResponse> DeleteReconcileTranAsync(DeleteReconcileTranRequest request);

        Task<ReconcileDetailResponse?> GetReconcileDetailAsync(long reconcileTranId);

        Task<ReconcileScanResponse> ReconcileAsync(ReconcileActionRequest request);

        Task<ReconcileScanResponse> CancelReconcileAsync(CancelReconcileRequest request);

        Task<ReconcileCountResponse> GetReconcileCountAsync(ReconcileCountRequest request);

        Task<EditPrepareHcResponse> EditPrepareHcAsync(EditPrepareHcRequest request);

        Task<EditMachineHcResponse> EditMachineHcAsync(EditMachineHcRequest request);
    }
}
