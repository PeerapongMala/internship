using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Revoke;

namespace BSS_WEB.Services
{
    public class RevokeTransactionService : BaseApiClient, IRevokeTransactionService
    {
        public RevokeTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<RevokeTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

<<<<<<< HEAD
        public async Task<ApiResponse<PagedData<RevokeTransactionResult>>> GetRevokeTransactionsAsync(
            PagedRequest<RevokeTransactionFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<RevokeTransactionResult>>>(
                HttpMethod.Post, "api/RevokeTransaction/GetRevokeTransactions", request);
        }

        public async Task<BaseApiResponse<RevokeScanResult>> ScanHeaderCardAsync(RevokeScanRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeScanResult>>(
                HttpMethod.Post, "api/RevokeTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<RevokeHeaderCardDetailResult>> GetHeaderCardDetailAsync(long verifyTranId)
        {
            return await SendAsync<BaseApiResponse<RevokeHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/RevokeTransaction/GetHeaderCardDetail/{verifyTranId}");
        }

        public async Task<BaseApiResponse<RevokeTransactionResult>> EditRevokeTranAsync(EditRevokeTranRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeTransactionResult>>(
                HttpMethod.Put, "api/RevokeTransaction/EditRevokeTran", request);
        }

        public async Task<BaseApiResponse<RevokeTransactionResult>> DeleteRevokeTranAsync(DeleteRevokeTranRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeTransactionResult>>(
                HttpMethod.Delete, "api/RevokeTransaction/DeleteRevokeTran", request);
        }

        public async Task<BaseApiResponse<RevokeDetailResult>> GetRevokeDetailAsync(long verifyTranId)
        {
            return await SendAsync<BaseApiResponse<RevokeDetailResult>>(
                HttpMethod.Get, $"api/RevokeTransaction/GetRevokeDetail/{verifyTranId}");
        }

        public async Task<BaseApiResponse<RevokeTransactionResult>> RevokeAsync(RevokeActionRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeTransactionResult>>(
                HttpMethod.Post, "api/RevokeTransaction/Revoke", request);
        }

        public async Task<BaseApiResponse<RevokeTransactionResult>> CancelRevokeAsync(CancelRevokeRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeTransactionResult>>(
                HttpMethod.Post, "api/RevokeTransaction/CancelRevoke", request);
        }

        public async Task<BaseApiResponse<RevokeCountResult>> GetRevokeCountAsync(RevokeCountRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeCountResult>>(
                HttpMethod.Post, "api/RevokeTransaction/GetRevokeCount", request);
=======
        public async Task<ApiResponse<PagedData<RevokeTransactionResult>>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<RevokeTransactionResult>>>(
                HttpMethod.Post, "api/RevokeTransaction/GetRevokeList", request);
        }

        public async Task<BaseApiResponse<RevokeDetailResult>> GetDetailAsync(string headerCardCode)
        {
            return await SendAsync<BaseApiResponse<RevokeDetailResult>>(
                HttpMethod.Get, $"api/RevokeTransaction/GetDetail?headerCardCode={headerCardCode}");
        }

        public async Task<BaseApiResponse<RevokeExecuteResult>> ExecuteRevokeAsync(RevokeActionRequest request)
        {
            return await SendAsync<BaseApiResponse<RevokeExecuteResult>>(
                HttpMethod.Post, "api/RevokeTransaction/ExecuteRevoke", request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
        }
    }
}
