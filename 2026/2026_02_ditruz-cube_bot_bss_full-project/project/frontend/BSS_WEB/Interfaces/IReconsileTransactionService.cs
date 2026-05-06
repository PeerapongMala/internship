using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconsile;

namespace BSS_WEB.Interfaces
{
    public interface IReconsileTransactionService
    {
        Task<ApiResponse<PagedData<ReconsileTransactionResult>>> GetReconsileTransactionsAsync(
            PagedRequest<ReconsileFilterRequest> request);

        Task<BaseApiResponse<ReconsileScanResult>> ScanHeaderCardAsync(ReconsileScanRequest request);

        Task<BaseApiResponse<ReconsileHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconsileTranId);

        Task<BaseApiResponse<ReconsileTransactionResult>> EditReconsileTranAsync(EditReconsileTranRequest request);

        Task<BaseApiResponse<ReconsileTransactionResult>> DeleteReconsileTranAsync(DeleteReconsileTranRequest request);

        Task<BaseApiResponse<ReconsileDetailResult>> GetReconsileDetailAsync(long reconsileTranId);

        Task<BaseApiResponse<ReconsileTransactionResult>> ReconsileAsync(ReconsileActionRequest request);

        Task<BaseApiResponse<ReconsileTransactionResult>> CancelReconsileAsync(CancelReconsileRequest request);

        Task<BaseApiResponse<ReconsileCountResult>> GetReconsileCountAsync(ReconsileCountRequest request);
    }
}
