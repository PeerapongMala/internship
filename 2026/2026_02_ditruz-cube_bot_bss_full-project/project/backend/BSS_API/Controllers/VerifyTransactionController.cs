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
    public class VerifyTransactionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionVerifyTranService _verifyTranService;
        private readonly ILogger<VerifyTransactionController> _logger;

        public VerifyTransactionController(
            IAppShare share,
            ITransactionVerifyTranService verifyTranService,
            ILogger<VerifyTransactionController> logger) : base(share)
        {
            _share = share;
            _verifyTranService = verifyTranService;
            _logger = logger;
        }

        [HttpPost("GetVerifyTransactions")]
        public async Task<IActionResult> GetVerifyTransactions(
            [FromBody] PagedRequest<VerifyTransactionFilterRequest> request,
            CancellationToken ct)
        {
            var data = await _verifyTranService.GetVerifyTransactionsAsync(request, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("ScanHeaderCard")]
        public async Task<IActionResult> ScanHeaderCard([FromBody] VerifyScanRequest request)
        {
            try
            {
                var data = await _verifyTranService.ScanHeaderCardAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ScanHeaderCard failed");
                return ApiInternalServerError("SCAN_HEADER_CARD_FAILED");
            }
        }

        [HttpGet("GetHeaderCardDetail")]
        public async Task<IActionResult> GetHeaderCardDetail(long verifyTranId)
        {
            var data = await _verifyTranService.GetHeaderCardDetailAsync(verifyTranId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPut("EditVerifyTran")]
        public async Task<IActionResult> EditVerifyTran([FromBody] EditVerifyTranRequest request)
        {
            try
            {
                var data = await _verifyTranService.EditVerifyTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditVerifyTran failed. Id={Id}", request.VerifyTranId);
                return ApiInternalServerError("EDIT_VERIFY_TRAN_FAILED");
            }
        }

        [HttpDelete("DeleteVerifyTran")]
        public async Task<IActionResult> DeleteVerifyTran([FromBody] DeleteVerifyTranRequest request)
        {
            try
            {
                var data = await _verifyTranService.DeleteVerifyTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteVerifyTran failed. Id={Id}", request.VerifyTranId);
                return ApiInternalServerError("DELETE_VERIFY_TRAN_FAILED");
            }
        }

        [HttpGet("GetVerifyDetail/{id}")]
        public async Task<IActionResult> GetVerifyDetail(long id)
        {
            var data = await _verifyTranService.GetVerifyDetailAsync(id);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("Verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyActionRequest request)
        {
            try
            {
                var data = await _verifyTranService.VerifyAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Verify failed. Id={Id}", request.VerifyTranId);
                return ApiInternalServerError("VERIFY_FAILED");
            }
        }

        [HttpPost("CancelVerify")]
        public async Task<IActionResult> CancelVerify([FromBody] CancelVerifyRequest request)
        {
            try
            {
                var data = await _verifyTranService.CancelVerifyAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CancelVerify failed. Id={Id}", request.VerifyTranId);
                return ApiInternalServerError("CANCEL_VERIFY_FAILED");
            }
        }

        [HttpPost("GetVerifyCount")]
        public async Task<IActionResult> GetVerifyCount([FromBody] VerifyCountRequest request)
        {
            var data = await _verifyTranService.GetVerifyCountAsync(request);
            return ApiSuccess(data);
        }
    }
}
