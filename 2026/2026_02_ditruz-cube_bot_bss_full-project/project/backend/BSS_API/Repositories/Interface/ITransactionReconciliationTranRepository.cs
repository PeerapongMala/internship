namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionReconciliationTranRepository : IGenericRepository<TransactionReconcileTran>
    {
        Task<PagedData<ReconciliationTransactionResponse>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request, CancellationToken ct = default);

        Task<TransactionReconcileTran?> GetReconciliationTranByIdAsync(long reconsileTranId);

        Task<ReconciliationHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconsileTranId);

        Task<ReconciliationDetailResponse?> GetReconciliationDetailAsync(long reconsileTranId);

        Task<ReconciliationCountResponse> GetReconciliationCountAsync(ReconciliationCountRequest request);
    }
}
