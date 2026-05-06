using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Revoke;

namespace BSS_WEB.Interfaces
{
    public interface IRevokeTransactionService
    {
<<<<<<< HEAD
        Task<ApiResponse<PagedData<RevokeTransactionResult>>> GetRevokeTransactionsAsync(
            PagedRequest<RevokeTransactionFilterRequest> request);

        Task<BaseApiResponse<RevokeScanResult>> ScanHeaderCardAsync(RevokeScanRequest request);

        Task<BaseApiResponse<RevokeHeaderCardDetailResult>> GetHeaderCardDetailAsync(long verifyTranId);

        Task<BaseApiResponse<RevokeTransactionResult>> EditRevokeTranAsync(EditRevokeTranRequest request);

        Task<BaseApiResponse<RevokeTransactionResult>> DeleteRevokeTranAsync(DeleteRevokeTranRequest request);

        Task<BaseApiResponse<RevokeDetailResult>> GetRevokeDetailAsync(long verifyTranId);

        Task<BaseApiResponse<RevokeTransactionResult>> RevokeAsync(RevokeActionRequest request);

        Task<BaseApiResponse<RevokeTransactionResult>> CancelRevokeAsync(CancelRevokeRequest request);

        Task<BaseApiResponse<RevokeCountResult>> GetRevokeCountAsync(RevokeCountRequest request);
=======
        Task<ApiResponse<PagedData<RevokeTransactionResult>>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request);

        Task<BaseApiResponse<RevokeDetailResult>> GetDetailAsync(string headerCardCode);

        Task<BaseApiResponse<RevokeExecuteResult>> ExecuteRevokeAsync(RevokeActionRequest request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }
}
