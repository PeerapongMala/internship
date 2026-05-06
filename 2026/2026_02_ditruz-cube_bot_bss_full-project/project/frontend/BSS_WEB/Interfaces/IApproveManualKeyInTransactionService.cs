using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.ApproveManualKeyIn;

namespace BSS_WEB.Interfaces
{
    public interface IApproveManualKeyInTransactionService
    {
        Task<ApiResponse<PagedData<ApproveManualKeyInTransactionResult>>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request);

        Task<BaseApiResponse<ApproveManualKeyInHeaderCardDetailResult>> GetHeaderCardDetailAsync(long approveManualKeyInTranId);

        Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> EditApproveManualKeyInTranAsync(EditApproveManualKeyInTranRequest request);

        Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> DeleteApproveManualKeyInTranAsync(DeleteApproveManualKeyInTranRequest request);

        Task<BaseApiResponse<ApproveManualKeyInDetailResult>> GetApproveManualKeyInDetailAsync(long approveManualKeyInTranId);

        Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> ApproveAsync(ApproveManualKeyInActionRequest request);

        Task<BaseApiResponse<ApproveManualKeyInTransactionResult>> DenyAsync(CancelApproveManualKeyInRequest request);

        Task<BaseApiResponse<ApproveManualKeyInCountResult>> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request);
    }
}
