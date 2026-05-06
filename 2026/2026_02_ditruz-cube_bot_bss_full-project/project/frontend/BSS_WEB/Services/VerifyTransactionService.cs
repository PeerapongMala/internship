using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Verify;

namespace BSS_WEB.Services
{
    public class VerifyTransactionService : BaseApiClient, IVerifyTransactionService
    {
        public VerifyTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<VerifyTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<ApiResponse<PagedData<VerifyTransactionResult>>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<VerifyTransactionResult>>>(
                HttpMethod.Post, "api/VerifyTransaction/GetVerifyTransactions", request);
        }

        public async Task<BaseApiResponse<VerifyScanResult>> ScanHeaderCardAsync(VerifyScanRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyScanResult>>(
                HttpMethod.Post, "api/VerifyTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<VerifyHeaderCardDetailResult>> GetHeaderCardDetailAsync(long verifyTranId)
        {
            return await SendAsync<BaseApiResponse<VerifyHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/VerifyTransaction/GetHeaderCardDetail/{verifyTranId}");
        }

        public async Task<BaseApiResponse<VerifyTransactionResult>> EditVerifyTranAsync(EditVerifyTranRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyTransactionResult>>(
                HttpMethod.Put, "api/VerifyTransaction/EditVerifyTran", request);
        }

        public async Task<BaseApiResponse<VerifyTransactionResult>> DeleteVerifyTranAsync(DeleteVerifyTranRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyTransactionResult>>(
                HttpMethod.Delete, "api/VerifyTransaction/DeleteVerifyTran", request);
        }

        public async Task<BaseApiResponse<VerifyDetailResult>> GetVerifyDetailAsync(long verifyTranId)
        {
            return await SendAsync<BaseApiResponse<VerifyDetailResult>>(
                HttpMethod.Get, $"api/VerifyTransaction/GetVerifyDetail/{verifyTranId}");
        }

        public async Task<BaseApiResponse<VerifyTransactionResult>> VerifyAsync(VerifyActionRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyTransactionResult>>(
                HttpMethod.Post, "api/VerifyTransaction/Verify", request);
        }

        public async Task<BaseApiResponse<VerifyTransactionResult>> CancelVerifyAsync(CancelVerifyRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyTransactionResult>>(
                HttpMethod.Post, "api/VerifyTransaction/CancelVerify", request);
        }

        public async Task<BaseApiResponse<VerifyCountResult>> GetVerifyCountAsync(VerifyCountRequest request)
        {
            return await SendAsync<BaseApiResponse<VerifyCountResult>>(
                HttpMethod.Post, "api/VerifyTransaction/GetVerifyCount", request);
        }
    }
}
