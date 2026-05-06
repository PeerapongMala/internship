using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconciliation;

namespace BSS_WEB.Interfaces
{
    public interface IReconciliationTransactionService
    {
        Task<ApiResponse<PagedData<ReconciliationTransactionResult>>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request);

        Task<BaseApiResponse<ReconciliationScanResult>> ScanHeaderCardAsync(ReconciliationScanRequest request);

        Task<BaseApiResponse<ReconciliationHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconsileTranId);

        Task<BaseApiResponse<ReconciliationTransactionResult>> EditReconciliationTranAsync(EditReconciliationTranRequest request);

        Task<BaseApiResponse<ReconciliationTransactionResult>> DeleteReconciliationTranAsync(DeleteReconciliationTranRequest request);

        Task<BaseApiResponse<ReconciliationDetailResult>> GetReconciliationDetailAsync(long reconsileTranId);

        Task<BaseApiResponse<ReconciliationTransactionResult>> ReconciliationAsync(ReconciliationActionRequest request);

        Task<BaseApiResponse<ReconciliationScanResult>> CancelReconciliationAsync(CancelReconciliationRequest request);

        Task<BaseApiResponse<ReconciliationCountResult>> GetReconciliationCountAsync(ReconciliationCountRequest request);

        Task<BaseApiResponse<CheckChildHeaderCardResult>> CheckChildHeaderCardAsync(string headerCardCode);
    }
}
