namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionReconcileTranRepository : IGenericRepository<TransactionReconcileTran>
    {
        Task<PagedData<ReconcileTransactionResponse>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request, CancellationToken ct = default);

        Task<TransactionReconcileTran?> GetReconcileTranByIdAsync(long reconcileTranId);

        Task<ReconcileHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId);

        Task<ReconcileDetailResponse?> GetReconcileDetailAsync(long reconcileTranId);

        Task<ReconcileCountResponse> GetReconcileCountAsync(ReconcileCountRequest request);
    }
}
