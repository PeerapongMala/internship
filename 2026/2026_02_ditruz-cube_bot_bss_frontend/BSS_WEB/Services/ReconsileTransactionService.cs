using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconsile;

namespace BSS_WEB.Services
{
    public class ReconsileTransactionService : BaseApiClient, IReconsileTransactionService
    {
        public ReconsileTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ReconsileTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<ApiResponse<PagedData<ReconsileTransactionResult>>> GetReconsileTransactionsAsync(
            PagedRequest<ReconsileFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<ReconsileTransactionResult>>>(
                HttpMethod.Post, "api/ReconsileTransaction/GetReconsileTransactions", request);
        }

        public async Task<BaseApiResponse<ReconsileScanResult>> ScanHeaderCardAsync(ReconsileScanRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileScanResult>>(
                HttpMethod.Post, "api/ReconsileTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<ReconsileHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconsileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconsileHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/ReconsileTransaction/GetHeaderCardDetail/{reconsileTranId}");
        }

        public async Task<BaseApiResponse<ReconsileTransactionResult>> EditReconsileTranAsync(EditReconsileTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileTransactionResult>>(
                HttpMethod.Put, "api/ReconsileTransaction/EditReconsileTran", request);
        }

        public async Task<BaseApiResponse<ReconsileTransactionResult>> DeleteReconsileTranAsync(DeleteReconsileTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileTransactionResult>>(
                HttpMethod.Delete, "api/ReconsileTransaction/DeleteReconsileTran", request);
        }

        public async Task<BaseApiResponse<ReconsileDetailResult>> GetReconsileDetailAsync(long reconsileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconsileDetailResult>>(
                HttpMethod.Get, $"api/ReconsileTransaction/GetReconsileDetail/{reconsileTranId}");
        }

        public async Task<BaseApiResponse<ReconsileTransactionResult>> ReconsileAsync(ReconsileActionRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileTransactionResult>>(
                HttpMethod.Post, "api/ReconsileTransaction/Reconsile", request);
        }

        public async Task<BaseApiResponse<ReconsileTransactionResult>> CancelReconsileAsync(CancelReconsileRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileTransactionResult>>(
                HttpMethod.Post, "api/ReconsileTransaction/CancelReconsile", request);
        }

        public async Task<BaseApiResponse<ReconsileCountResult>> GetReconsileCountAsync(ReconsileCountRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconsileCountResult>>(
                HttpMethod.Post, "api/ReconsileTransaction/GetReconsileCount", request);
        }
    }
}
