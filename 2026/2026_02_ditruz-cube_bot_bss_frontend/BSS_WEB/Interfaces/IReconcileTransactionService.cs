using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconcile;

namespace BSS_WEB.Interfaces
{
    public interface IReconcileTransactionService
    {
        Task<ApiResponse<PagedData<ReconcileTransactionResult>>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request);

        Task<BaseApiResponse<ReconcileScanResult>> ScanHeaderCardAsync(ReconcileScanRequest request);

        Task<BaseApiResponse<ReconcileHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconcileTranId);

        Task<BaseApiResponse<ReconcileTransactionResult>> EditReconcileTranAsync(EditReconcileTranRequest request);

        Task<BaseApiResponse<ReconcileTransactionResult>> DeleteReconcileTranAsync(DeleteReconcileTranRequest request);

        Task<BaseApiResponse<ReconcileDetailResult>> GetReconcileDetailAsync(long reconcileTranId);

        Task<BaseApiResponse<ReconcileTransactionResult>> ReconcileAsync(ReconcileActionRequest request);

        Task<BaseApiResponse<ReconcileTransactionResult>> CancelReconcileAsync(CancelReconcileRequest request);

        Task<BaseApiResponse<ReconcileCountResult>> GetReconcileCountAsync(ReconcileCountRequest request);
<<<<<<< HEAD
=======

        Task<BaseApiResponse<RefreshResult>> RefreshAsync(RefreshRequest request);

        Task<BaseApiResponse<List<MachineHeaderCardResult>>> GetMachineHeaderCardsAsync(int machineId);

        Task<BaseApiResponse<List<PrepareHeaderCardResult>>> GetPrepareHeaderCardsAsync(
            int departmentId, int? machineId, string? bnTypeCode = null);

        Task<BaseApiResponse<EditPrepareHcResult>> EditPrepareHcAsync(EditPrepareHcRequest request);

        Task<BaseApiResponse<EditMachineHcResult>> EditMachineHcAsync(EditMachineHcRequest request);
>>>>>>> bd16f561348fd0fd7dac18a74df6a46eb3d8635f
    }
}
