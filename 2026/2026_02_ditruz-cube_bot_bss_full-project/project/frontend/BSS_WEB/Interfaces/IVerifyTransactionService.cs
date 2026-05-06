using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Verify;

namespace BSS_WEB.Interfaces
{
    public interface IVerifyTransactionService
    {
        Task<ApiResponse<PagedData<VerifyTransactionResult>>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request);

        Task<BaseApiResponse<VerifyScanResult>> ScanHeaderCardAsync(VerifyScanRequest request);

        Task<BaseApiResponse<VerifyHeaderCardDetailResult>> GetHeaderCardDetailAsync(long verifyTranId);

        Task<BaseApiResponse<VerifyTransactionResult>> EditVerifyTranAsync(EditVerifyTranRequest request);

        Task<BaseApiResponse<VerifyTransactionResult>> DeleteVerifyTranAsync(DeleteVerifyTranRequest request);

        Task<BaseApiResponse<VerifyDetailResult>> GetVerifyDetailAsync(long verifyTranId);

        Task<BaseApiResponse<VerifyTransactionResult>> VerifyAsync(VerifyActionRequest request);

        Task<BaseApiResponse<VerifyTransactionResult>> CancelVerifyAsync(CancelVerifyRequest request);

        Task<BaseApiResponse<VerifyCountResult>> GetVerifyCountAsync(VerifyCountRequest request);
    }
}
