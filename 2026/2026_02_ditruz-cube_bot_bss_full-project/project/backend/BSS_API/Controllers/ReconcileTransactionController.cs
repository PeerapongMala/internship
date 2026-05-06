namespace BSS_API.Controllers
{
    using Helpers;
    using Models.Common;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class ReconcileTransactionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionReconcileTranService _reconcileTranService;
        private readonly IMachineDataImportService _machineDataImportService;
        private readonly ILogger<ReconcileTransactionController> _logger;

        public ReconcileTransactionController(
            IAppShare share,
            ITransactionReconcileTranService reconcileTranService,
            IMachineDataImportService machineDataImportService,
            ILogger<ReconcileTransactionController> logger) : base(share)
        {
            _share = share;
            _reconcileTranService = reconcileTranService;
            _machineDataImportService = machineDataImportService;
            _logger = logger;
        }

        [HttpPost("GetReconcileTransactions")]
        public async Task<IActionResult> GetReconcileTransactions(
            [FromBody] PagedRequest<ReconcileTransactionFilterRequest> request,
            CancellationToken ct)
        {
            var data = await _reconcileTranService.GetReconcileTransactionsAsync(request, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("ScanHeaderCard")]
        public async Task<IActionResult> ScanHeaderCard([FromBody] ReconcileScanRequest request)
        {
            try
            {
                var data = await _reconcileTranService.ScanHeaderCardAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return ApiInternalServerError("SCAN_HEADER_CARD_FAILED");
            }
        }

        [HttpGet("GetHeaderCardDetail")]
        public async Task<IActionResult> GetHeaderCardDetail(long reconcileTranId)
        {
            var data = await _reconcileTranService.GetHeaderCardDetailAsync(reconcileTranId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPut("EditReconcileTran")]
        public async Task<IActionResult> EditReconcileTran([FromBody] EditReconcileTranRequest request)
        {
            try
            {
                var data = await _reconcileTranService.EditReconcileTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditReconcileTran failed. Id={Id}", request.ReconcileTranId);
                return ApiInternalServerError("EDIT_RECONCILE_TRAN_FAILED");
            }
        }

        [HttpDelete("DeleteReconcileTran")]
        public async Task<IActionResult> DeleteReconcileTran([FromBody] DeleteReconcileTranRequest request)
        {
            try
            {
                var data = await _reconcileTranService.DeleteReconcileTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteReconcileTran failed. Id={Id}", request.ReconcileTranId);
                return ApiInternalServerError("DELETE_RECONCILE_TRAN_FAILED");
            }
        }

        [HttpGet("GetReconcileDetail/{id}")]
        public async Task<IActionResult> GetReconcileDetail(long id)
        {
            var data = await _reconcileTranService.GetReconcileDetailAsync(id);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("Reconcile")]
        public async Task<IActionResult> Reconcile([FromBody] ReconcileActionRequest request)
        {
            try
            {
                var data = await _reconcileTranService.ReconcileAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reconcile failed. Id={Id}", request.ReconcileTranId);
                return ApiInternalServerError("RECONCILE_FAILED");
            }
        }

        [HttpPost("CancelReconcile")]
        public async Task<IActionResult> CancelReconcile([FromBody] CancelReconcileRequest request)
        {
            try
            {
                var data = await _reconcileTranService.CancelReconcileAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelReconcile failed. Id={Id}", request.ReconcileTranId);
                return ApiInternalServerError("CANCEL_RECONCILE_FAILED");
            }
        }

        [HttpPost("GetReconcileCount")]
        public async Task<IActionResult> GetReconcileCount([FromBody] ReconcileCountRequest request)
        {
            var data = await _reconcileTranService.GetReconcileCountAsync(request);
            return ApiSuccess(data);
        }

        [HttpPut("EditPrepareHc")]
        public async Task<IActionResult> EditPrepareHc([FromBody] EditPrepareHcRequest request)
        {
            try
            {
                var data = await _reconcileTranService.EditPrepareHcAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPrepareHc failed. Id={Id}", request.PrepareId);
                return ApiInternalServerError("EDIT_PREPARE_HC_FAILED");
            }
        }

        [HttpPut("EditMachineHc")]
        public async Task<IActionResult> EditMachineHc([FromBody] EditMachineHcRequest request)
        {
            try
            {
                var data = await _reconcileTranService.EditMachineHcAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditMachineHc failed. Id={Id}", request.MachineHdId);
                return ApiInternalServerError("EDIT_MACHINE_HC_FAILED");
            }
        }

        [HttpPost("GetPrepareHeaderCards")]
        public async Task<IActionResult> GetPrepareHeaderCards([FromBody] GetPrepareHeaderCardsRequest request)
        {
            try
            {
                var data = await _machineDataImportService.GetPrepareHeaderCardsAsync(
                    request.DepartmentId, request.MachineId, request.BnTypeCode);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPrepareHeaderCards failed for dept {DeptId}", request.DepartmentId);
                return ApiInternalServerError("GET_PREPARE_HEADER_CARDS_FAILED");
            }
        }

        [HttpGet("GetMachineHeaderCards")]
        public async Task<IActionResult> GetMachineHeaderCards(int machineId)
        {
            try
            {
                var data = await _machineDataImportService.GetMachineHeaderCardsAsync(machineId);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetMachineHeaderCards failed for machine {MachineId}", machineId);
                return ApiInternalServerError("GET_MACHINE_HEADER_CARDS_FAILED");
            }
        }

        [HttpPost("Refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                var userId = RequestContextHelper.GetUserId();
                var data = await _machineDataImportService.RefreshAsync(request.MachineId, userId);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Refresh failed for machine {MachineId}", request.MachineId);
                return ApiInternalServerError("REFRESH_FAILED");
            }
        }
    }
}
