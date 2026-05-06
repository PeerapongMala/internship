namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionVerifyTranService
    {
        Task<PagedData<VerifyTransactionResponse>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request, CancellationToken ct = default);

        Task<VerifyScanResponse> ScanHeaderCardAsync(VerifyScanRequest request);

        Task<VerifyHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long verifyTranId);

        Task<EditVerifyTranResponse> EditVerifyTranAsync(EditVerifyTranRequest request);

        Task<DeleteVerifyTranResponse> DeleteVerifyTranAsync(DeleteVerifyTranRequest request);

        Task<VerifyDetailResponse?> GetVerifyDetailAsync(long verifyTranId);

        Task<VerifyScanResponse> VerifyAsync(VerifyActionRequest request);

        Task<VerifyScanResponse> CancelVerifyAsync(CancelVerifyRequest request);

        Task<VerifyCountResponse> GetVerifyCountAsync(VerifyCountRequest request);
    }
}
