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
        }
    }
}
