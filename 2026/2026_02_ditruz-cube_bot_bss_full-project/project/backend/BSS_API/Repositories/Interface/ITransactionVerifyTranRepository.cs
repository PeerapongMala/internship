namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionVerifyTranRepository : IGenericRepository<TransactionVerifyTran>
    {
        Task<PagedData<VerifyTransactionResponse>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request, CancellationToken ct = default);

        Task<TransactionVerifyTran?> GetVerifyTranByIdAsync(long verifyTranId);

        Task<VerifyHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long verifyTranId);

        Task<VerifyDetailResponse?> GetVerifyDetailAsync(long verifyTranId);

        Task<VerifyCountResponse> GetVerifyCountAsync(VerifyCountRequest request);
    }
}
