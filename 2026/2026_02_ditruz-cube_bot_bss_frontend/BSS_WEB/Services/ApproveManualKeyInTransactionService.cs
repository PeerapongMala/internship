using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.ApproveManualKeyIn;

namespace BSS_WEB.Services
{
    public class ApproveManualKeyInTransactionService : BaseApiClient, IApproveManualKeyInTransactionService
    {
        public ApproveManualKeyInTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ApproveManualKeyInTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<ApiResponse<PagedData<ApproveManualKeyInTransactionResult>>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<ApproveManualKeyInTransactionResult>>>(
                HttpMethod.Post, "api/ApproveManualKeyInTransaction/GetApproveManualKeyInTransactions", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInScanResult>> ScanHeaderCardAsync(ApproveManualKeyInScanRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInScanResult>>(
                HttpMethod.Post, "api/ApproveManualKeyInTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInHeaderCardDetailResult>> GetHeaderCardDetailAsync(long approveManualKeyInTranId)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/ApproveManualKeyInTransaction/GetHeaderCardDetail?approveManualKeyInTranId={approveManualKeyInTranId}");
        }

        public async Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> EditApproveManualKeyInTranAsync(EditApproveManualKeyInTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInTransactionResult>>(
                HttpMethod.Put, "api/ApproveManualKeyInTransaction/EditApproveManualKeyInTran", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> DeleteApproveManualKeyInTranAsync(DeleteApproveManualKeyInTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInTransactionResult>>(
                HttpMethod.Delete, "api/ApproveManualKeyInTransaction/DeleteApproveManualKeyInTran", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInDetailResult>> GetApproveManualKeyInDetailAsync(long approveManualKeyInTranId)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInDetailResult>>(
                HttpMethod.Get, $"api/ApproveManualKeyInTransaction/GetApproveManualKeyInDetail/{approveManualKeyInTranId}");
        }

        public async Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> ApproveAsync(ApproveManualKeyInActionRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInTransactionResult>>(
                HttpMethod.Post, "api/ApproveManualKeyInTransaction/Approve", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> DenyAsync(CancelApproveManualKeyInRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInTransactionResult>>(
                HttpMethod.Post, "api/ApproveManualKeyInTransaction/Deny", request);
        }

        public async Task<BaseApiResponse<ApproveManualKeyInCountResult>> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request)
        {
            return await SendAsync<BaseApiResponse<ApproveManualKeyInCountResult>>(
                HttpMethod.Post, "api/ApproveManualKeyInTransaction/GetApproveManualKeyInCount", request);
        }
    }
}
