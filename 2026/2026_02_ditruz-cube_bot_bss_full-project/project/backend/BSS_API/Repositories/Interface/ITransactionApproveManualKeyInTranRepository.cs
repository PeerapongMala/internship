namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionApproveManualKeyInTranRepository : IGenericRepository<TransactionApproveManualKeyInTran>
    {
        Task<PagedData<ApproveManualKeyInTransactionResponse>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request, CancellationToken ct = default);

        Task<TransactionReconcileTran?> GetReconcileTranByIdAsync(long reconcileTranId);

        Task<ApproveManualKeyInHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId);

        Task<ApproveManualKeyInDetailResponse?> GetApproveManualKeyInDetailAsync(long reconcileTranId);

        Task<ApproveManualKeyInCountResponse> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request);

        Task<List<TransactionManualTmp>> GetManualTmpByTranIdAsync(long reconcileTranId);

        Task AddManualTmpAsync(TransactionManualTmp detail);

        // Legacy methods — used by ManualKeyInService (Terminal A)
        Task<TransactionApproveManualKeyInTran?> GetApproveManualKeyInTranByIdAsync(long approveManualKeyInTranId);

        Task<List<TransactionApproveManualKeyIn>> GetDetailsByTranIdAsync(long approveManualKeyInTranId);

        Task AddDetailAsync(TransactionApproveManualKeyIn detail);

        Task SoftDeleteDetailsByTranIdAsync(long approveManualKeyInTranId, int updatedBy);
    }
}
