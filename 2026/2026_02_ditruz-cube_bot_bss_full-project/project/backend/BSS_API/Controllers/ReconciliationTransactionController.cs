namespace BSS_API.Controllers
{
    using Helpers;
    using Models;
    using Models.Common;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    public class DevResetHcRequest { public string HeaderCardCode { get; set; } = string.Empty; }

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class ReconciliationTransactionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionReconciliationTranService _reconsileTranService;
        private readonly ILogger<ReconciliationTransactionController> _logger;
        private readonly ApplicationDbContext _db;

        public ReconciliationTransactionController(
            IAppShare share,
            ITransactionReconciliationTranService reconsileTranService,
            ILogger<ReconciliationTransactionController> logger,
            ApplicationDbContext db) : base(share)
        {
            _share = share;
            _reconsileTranService = reconsileTranService;
            _logger = logger;
            _db = db;
        }

        [HttpPost("GetReconciliationTransactions")]
        public async Task<IActionResult> GetReconciliationTransactions(
            [FromBody] PagedRequest<ReconciliationFilterRequest> request,
            CancellationToken ct)
        {
            var data = await _reconsileTranService.GetReconciliationTransactionsAsync(request, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("ScanHeaderCard")]
        public async Task<IActionResult> ScanHeaderCard([FromBody] ReconciliationScanRequest request)
        {
            try
            {
                var data = await _reconsileTranService.ScanHeaderCardAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return ApiInternalServerError("SCAN_HEADER_CARD_FAILED");
            }
        }

        /// <summary>
        /// UC05: เช็ค child HC ว่ามียอดเครื่องจักรหรือไม่ (ไม่สร้าง reconcile_tran)
        /// </summary>
        [HttpGet("CheckChildHeaderCard/{headerCardCode}")]
        public async Task<IActionResult> CheckChildHeaderCard(string headerCardCode)
        {
            var data = await _reconsileTranService.CheckChildHeaderCardAsync(headerCardCode);
            return ApiSuccess(data);
        }

        [HttpGet("GetHeaderCardDetail/{reconsileTranId}")]
        public async Task<IActionResult> GetHeaderCardDetail(long reconsileTranId)
        {
            var data = await _reconsileTranService.GetHeaderCardDetailAsync(reconsileTranId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPut("EditReconciliationTran")]
        public async Task<IActionResult> EditReconciliationTran([FromBody] EditReconciliationTranRequest request)
        {
            try
            {
                var data = await _reconsileTranService.EditReconciliationTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditReconciliationTran failed. Id={Id}", request.ReconciliationTranId);
                return ApiInternalServerError("EDIT_RECONSILE_TRAN_FAILED");
            }
        }

        [HttpDelete("DeleteReconciliationTran")]
        public async Task<IActionResult> DeleteReconciliationTran([FromBody] DeleteReconciliationTranRequest request)
        {
            try
            {
                var data = await _reconsileTranService.DeleteReconciliationTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteReconciliationTran failed. Id={Id}", request.ReconciliationTranId);
                return ApiInternalServerError("DELETE_RECONSILE_TRAN_FAILED");
            }
        }

        [HttpGet("GetReconciliationDetail/{id}")]
        public async Task<IActionResult> GetReconciliationDetail(long id)
        {
            var data = await _reconsileTranService.GetReconciliationDetailAsync(id);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("Reconciliation")]
        public async Task<IActionResult> Reconciliation([FromBody] ReconciliationActionRequest request)
        {
            try
            {
                var data = await _reconsileTranService.ReconciliationAsync(request);

                // Propagate WARNING to outer msg_code so frontend JS can detect it
                if (data.Message == "WARNING")
                {
                    return Ok(new Models.ResponseModels.BaseResponse<Models.ResponseModels.ReconciliationScanResponse>
                    {
                        is_success = true,
                        msg_code = "WARNING",
                        msg_desc = "มียอดขาด - เกิน",
                        data = data
                    });
                }

                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Reconciliation failed. Id={Id}", request.ReconciliationTranId);
                return ApiInternalServerError("RECONCILE_FAILED");
            }
        }

        [HttpPost("CancelReconciliation")]
        public async Task<IActionResult> CancelReconciliation([FromBody] CancelReconciliationRequest request)
        {
            try
            {
                var data = await _reconsileTranService.CancelReconciliationAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelReconciliation failed. Id={Id}", request.ReconciliationTranId);
                return ApiInternalServerError("CANCEL_RECONSILE_FAILED");
            }
        }

        [HttpPost("GetReconciliationCount")]
        public async Task<IActionResult> GetReconciliationCount([FromBody] ReconciliationCountRequest request)
        {
            var data = await _reconsileTranService.GetReconciliationCountAsync(request);
            return ApiSuccess(data);
        }

        // DEV ONLY — reset HC back to Prepared for re-testing
        [HttpPost("DevResetHeaderCard")]
        public async Task<IActionResult> DevResetHeaderCard([FromBody] DevResetHcRequest request)
        {
            var tran = _db.TransactionReconcileTran
                .FirstOrDefault(x => x.HeaderCardCode == request.HeaderCardCode);
            if (tran == null) return ApiBadRequest("HC not found");

            // Delete tmp rows
            var tmpRows = _db.TransactionReconcileTmp
                .Where(x => x.ReconcileTranId == tran.ReconcileTranId).ToList();
            _db.TransactionReconcileTmp.RemoveRange(tmpRows);

            // Delete reconcile rows
            var recRows = _db.TransactionReconcile
                .Where(x => x.ReconcileTranId == tran.ReconcileTranId).ToList();
            _db.TransactionReconcile.RemoveRange(recRows);

            // Reset status to Prepared (9)
            tran.StatusId = 9;
            tran.IsWarning = false;
            tran.ReconcileQty = 0;
            tran.ReconcileTotalValue = 0;
            tran.CountReconcile = 0;
            tran.IsNotReconcile = false;

            // Reset preparation.IsReconcile so ScanHeaderCard allows re-scan
            var prep = _db.TransactionPreparation
                .FirstOrDefault(p => p.HeaderCardCode == request.HeaderCardCode && p.IsActive == true);
            if (prep != null)
            {
                prep.IsReconcile = false;
            }

            await _db.SaveChangesAsync();
            return ApiSuccess("Reset OK");
        }
    }
}
