using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Revoke;

namespace BSS_WEB.Interfaces
{
    public interface IRevokeTransactionService
    {
        Task<ApiResponse<PagedData<RevokeTransactionResult>>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request);

        Task<BaseApiResponse<RevokeDetailResult>> GetDetailAsync(string headerCardCode);

        Task<BaseApiResponse<RevokeExecuteResult>> ExecuteRevokeAsync(RevokeActionRequest request);
    }
}
