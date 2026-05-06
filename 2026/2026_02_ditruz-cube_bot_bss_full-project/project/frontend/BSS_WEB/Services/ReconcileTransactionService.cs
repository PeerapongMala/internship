using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Reconcile;

namespace BSS_WEB.Services
{
    public class ReconcileTransactionService : BaseApiClient, IReconcileTransactionService
    {
        public ReconcileTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ReconcileTransactionService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<ApiResponse<PagedData<ReconcileTransactionResult>>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<ReconcileTransactionResult>>>(
                HttpMethod.Post, "api/ReconcileTransaction/GetReconcileTransactions", request);
        }

        public async Task<BaseApiResponse<ReconcileScanResult>> ScanHeaderCardAsync(ReconcileScanRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileScanResult>>(
                HttpMethod.Post, "api/ReconcileTransaction/ScanHeaderCard", request);
        }

        public async Task<BaseApiResponse<ReconcileHeaderCardDetailResult>> GetHeaderCardDetailAsync(long reconcileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconcileHeaderCardDetailResult>>(
                HttpMethod.Get, $"api/ReconcileTransaction/GetHeaderCardDetail/{reconcileTranId}");
        }

        public async Task<BaseApiResponse<ReconcileTransactionResult>> EditReconcileTranAsync(EditReconcileTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileTransactionResult>>(
                HttpMethod.Put, "api/ReconcileTransaction/EditReconcileTran", request);
        }

        public async Task<BaseApiResponse<ReconcileTransactionResult>> DeleteReconcileTranAsync(DeleteReconcileTranRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileTransactionResult>>(
                HttpMethod.Delete, "api/ReconcileTransaction/DeleteReconcileTran", request);
        }

        public async Task<BaseApiResponse<ReconcileDetailResult>> GetReconcileDetailAsync(long reconcileTranId)
        {
            return await SendAsync<BaseApiResponse<ReconcileDetailResult>>(
                HttpMethod.Get, $"api/ReconcileTransaction/GetReconcileDetail/{reconcileTranId}");
        }

        public async Task<BaseApiResponse<ReconcileTransactionResult>> ReconcileAsync(ReconcileActionRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileTransactionResult>>(
                HttpMethod.Post, "api/ReconcileTransaction/Reconcile", request);
        }

        public async Task<BaseApiResponse<ReconcileTransactionResult>> CancelReconcileAsync(CancelReconcileRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileTransactionResult>>(
                HttpMethod.Post, "api/ReconcileTransaction/CancelReconcile", request);
        }

        public async Task<BaseApiResponse<ReconcileCountResult>> GetReconcileCountAsync(ReconcileCountRequest request)
        {
            return await SendAsync<BaseApiResponse<ReconcileCountResult>>(
                HttpMethod.Post, "api/ReconcileTransaction/GetReconcileCount", request);
        }

        public async Task<BaseApiResponse<RefreshResult>> RefreshAsync(RefreshRequest request)
        {
            return await SendAsync<BaseApiResponse<RefreshResult>>(
                HttpMethod.Post, "api/ReconcileTransaction/Refresh", request);
        }

        public async Task<BaseApiResponse<List<MachineHeaderCardResult>>> GetMachineHeaderCardsAsync(int machineId)
        {
            return await SendAsync<BaseApiResponse<List<MachineHeaderCardResult>>>(
                HttpMethod.Get, $"api/ReconcileTransaction/GetMachineHeaderCards?machineId={machineId}");
        }

        public async Task<BaseApiResponse<List<PrepareHeaderCardResult>>> GetPrepareHeaderCardsAsync(
            int departmentId, int? machineId, string? bnTypeCode = null)
        {
            var request = new { DepartmentId = departmentId, MachineId = machineId, BnTypeCode = bnTypeCode };
            return await SendAsync<BaseApiResponse<List<PrepareHeaderCardResult>>>(
                HttpMethod.Post, "api/ReconcileTransaction/GetPrepareHeaderCards", request);
        }

        public async Task<BaseApiResponse<EditPrepareHcResult>> EditPrepareHcAsync(EditPrepareHcRequest request)
        {
            return await SendAsync<BaseApiResponse<EditPrepareHcResult>>(
                HttpMethod.Put, "api/ReconcileTransaction/EditPrepareHc", request);
        }

        public async Task<BaseApiResponse<EditMachineHcResult>> EditMachineHcAsync(EditMachineHcRequest request)
        {
            return await SendAsync<BaseApiResponse<EditMachineHcResult>>(
                HttpMethod.Put, "api/ReconcileTransaction/EditMachineHc", request);
        }
    }
}
