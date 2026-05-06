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
    public class ApproveManualKeyInTransactionController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionApproveManualKeyInTranService _approveManualKeyInTranService;
        private readonly ILogger<ApproveManualKeyInTransactionController> _logger;

        public ApproveManualKeyInTransactionController(
            IAppShare share,
            ITransactionApproveManualKeyInTranService approveManualKeyInTranService,
            ILogger<ApproveManualKeyInTransactionController> logger) : base(share)
        {
            _share = share;
            _approveManualKeyInTranService = approveManualKeyInTranService;
            _logger = logger;
        }

        [HttpPost("GetApproveManualKeyInTransactions")]
        public async Task<IActionResult> GetApproveManualKeyInTransactions(
            [FromBody] PagedRequest<ApproveManualKeyInTransactionFilterRequest> request,
            CancellationToken ct)
        {
            var data = await _approveManualKeyInTranService.GetApproveManualKeyInTransactionsAsync(request, ct);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpGet("GetHeaderCardDetail")]
        public async Task<IActionResult> GetHeaderCardDetail(long approveManualKeyInTranId)
        {
            var data = await _approveManualKeyInTranService.GetHeaderCardDetailAsync(approveManualKeyInTranId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPut("EditApproveManualKeyInTran")]
        public async Task<IActionResult> EditApproveManualKeyInTran([FromBody] EditApproveManualKeyInTranRequest request)
        {
            try
            {
                var data = await _approveManualKeyInTranService.EditApproveManualKeyInTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return ApiInternalServerError("EDIT_APPROVE_MANUAL_KEY_IN_TRAN_FAILED");
            }
        }

        [HttpDelete("DeleteApproveManualKeyInTran")]
        public async Task<IActionResult> DeleteApproveManualKeyInTran([FromBody] DeleteApproveManualKeyInTranRequest request)
        {
            try
            {
                var data = await _approveManualKeyInTranService.DeleteApproveManualKeyInTranAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteApproveManualKeyInTran failed. Id={Id}", request.ApproveManualKeyInTranId);
                return ApiInternalServerError("DELETE_APPROVE_MANUAL_KEY_IN_TRAN_FAILED");
            }
        }

        [HttpGet("GetApproveManualKeyInDetail/{id}")]
        public async Task<IActionResult> GetApproveManualKeyInDetail(long id)
        {
            var data = await _approveManualKeyInTranService.GetApproveManualKeyInDetailAsync(id);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }
            return ApiSuccess(data);
        }

        [HttpPost("Approve")]
        public async Task<IActionResult> Approve([FromBody] ApproveManualKeyInActionRequest request)
        {
            try
            {
                var data = await _approveManualKeyInTranService.ApproveAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Approve failed. Id={Id}", request.ApproveManualKeyInTranId);
                return ApiInternalServerError("APPROVE_FAILED");
            }
        }

        [HttpPost("Deny")]
        public async Task<IActionResult> Deny([FromBody] CancelApproveManualKeyInRequest request)
        {
            try
            {
                var data = await _approveManualKeyInTranService.DenyAsync(request);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Deny failed. Id={Id}", request.ApproveManualKeyInTranId);
                return ApiInternalServerError("DENY_FAILED");
            }
        }

        [HttpPost("GetApproveManualKeyInCount")]
        public async Task<IActionResult> GetApproveManualKeyInCount([FromBody] ApproveManualKeyInCountRequest request)
        {
            var data = await _approveManualKeyInTranService.GetApproveManualKeyInCountAsync(request);
            return ApiSuccess(data);
        }
    }
}
