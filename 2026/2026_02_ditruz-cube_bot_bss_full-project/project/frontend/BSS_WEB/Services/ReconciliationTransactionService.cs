using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconciliation;

namespace BSS_WEB.Services
{
    public class ReconciliationTransactionService : BaseApiClient, IReconciliationTransactionService
    {
        public ReconciliationTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ReconciliationTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<ApiResponse<PagedData<ReconciliationTransactionResult>>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<ReconciliationTransactionResult>>>(
                HttpMethod.Post, "api/ReconciliationTransaction/GetReconciliationTransactions", request);
        }

        public async Task<BaseApiResponse<ReconciliationScanResult>> ScanHeaderCardAsync(ReconciliationScanRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationScanResult>>(
                HttpMethod.Post, "api/ReconciliationTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<ReconciliationHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconsileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconciliationHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/ReconciliationTransaction/GetHeaderCardDetail/{reconsileTranId}");
        }

        public async Task<BaseApiResponse<ReconciliationTransactionResult>> EditReconciliationTranAsync(EditReconciliationTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationTransactionResult>>(
                HttpMethod.Put, "api/ReconciliationTransaction/EditReconciliationTran", request);
        }

        public async Task<BaseApiResponse<ReconciliationTransactionResult>> DeleteReconciliationTranAsync(DeleteReconciliationTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationTransactionResult>>(
                HttpMethod.Delete, "api/ReconciliationTransaction/DeleteReconciliationTran", request);
        }

        public async Task<BaseApiResponse<ReconciliationDetailResult>> GetReconciliationDetailAsync(long reconsileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconciliationDetailResult>>(
                HttpMethod.Get, $"api/ReconciliationTransaction/GetReconciliationDetail/{reconsileTranId}");
        }

        public async Task<BaseApiResponse<ReconciliationTransactionResult>> ReconciliationAsync(ReconciliationActionRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationTransactionResult>>(
                HttpMethod.Post, "api/ReconciliationTransaction/Reconciliation", request);
        }

        public async Task<BaseApiResponse<ReconciliationScanResult>> CancelReconciliationAsync(CancelReconciliationRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationScanResult>>(
                HttpMethod.Post, "api/ReconciliationTransaction/CancelReconciliation", request);
        }

        public async Task<BaseApiResponse<ReconciliationCountResult>> GetReconciliationCountAsync(ReconciliationCountRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconciliationCountResult>>(
                HttpMethod.Post, "api/ReconciliationTransaction/GetReconciliationCount", request);
        }

        public async Task<BaseApiResponse<CheckChildHeaderCardResult>> CheckChildHeaderCardAsync(string headerCardCode)
        {
            return await SendAsync<BaseApiResponse<CheckChildHeaderCardResult>>(
                HttpMethod.Get, $"api/ReconciliationTransaction/CheckChildHeaderCard/{headerCardCode}");
        }
    }
}
