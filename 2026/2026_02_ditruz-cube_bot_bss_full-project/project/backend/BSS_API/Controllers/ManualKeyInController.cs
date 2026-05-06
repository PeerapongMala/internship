namespace BSS_API.Controllers
{
    using Helpers;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class ManualKeyInController : BaseController
    {
        private readonly IManualKeyInService _manualKeyInService;
        private readonly ILogger<ManualKeyInController> _logger;

        public ManualKeyInController(
            IAppShare share,
            IManualKeyInService manualKeyInService,
            ILogger<ManualKeyInController> logger) : base(share)
        {
            _manualKeyInService = manualKeyInService;
            _logger = logger;
        }

        /// <summary>
        /// Get header card info by header card code (for loading Edit Manual Key-In page)
        /// </summary>
        [HttpGet("GetHeaderCardInfo")]
        public async Task<IActionResult> GetHeaderCardInfo(
            [FromQuery] string headerCardCode,
            CancellationToken ct)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(headerCardCode))
                {
                    return ApiBadRequest("HEADER_CARD_CODE_REQUIRED");
                }

                var data = await _manualKeyInService.GetHeaderCardInfoAsync(headerCardCode, ct);
                if (data == null)
                {
                    return ApiDataNotFound("ไม่พบข้อมูล Header Card");
                }
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetHeaderCardInfo failed. HeaderCardCode={HeaderCardCode}", headerCardCode);
                return ApiInternalServerError("GET_HEADER_CARD_INFO_FAILED");
            }
        }

        /// <summary>
        /// Get denomination list for a preparation (existing manual key-in data)
        /// </summary>
        [HttpGet("GetDenominations")]
        public async Task<IActionResult> GetDenominations(
            [FromQuery] long prepareId,
            CancellationToken ct)
        {
            try
            {
                if (prepareId <= 0)
                {
                    return ApiBadRequest("INVALID_PREPARE_ID");
                }

                var data = await _manualKeyInService.GetDenominationsAsync(prepareId, ct);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDenominations failed. PrepareId={PrepareId}", prepareId);
                return ApiInternalServerError("GET_DENOMINATIONS_FAILED");
            }
        }

        /// <summary>
        /// Save manual key-in data (create/update transaction + detail rows)
        /// </summary>
        [HttpPost("Save")]
        public async Task<IActionResult> Save(
            [FromBody] ManualKeyInSaveRequest request,
            CancellationToken ct)
        {
            try
            {
                if (request.PrepareId <= 0)
                {
                    return ApiBadRequest("INVALID_PREPARE_ID");
                }

                if (string.IsNullOrWhiteSpace(request.HeaderCardCode))
                {
                    return ApiBadRequest("HEADER_CARD_CODE_REQUIRED");
                }

                if (request.Items == null || !request.Items.Any())
                {
                    return ApiBadRequest("ITEMS_REQUIRED");
                }

                var data = await _manualKeyInService.SaveAsync(request, ct);

                if (!data.IsSuccess)
                {
                    return ApiBadRequest(data.Message);
                }

                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ManualKeyIn Save failed. PrepareId={PrepareId}", request.PrepareId);
                return ApiInternalServerError("MANUAL_KEY_IN_SAVE_FAILED");
            }
        }

        /// <summary>
        /// Submit manual key-in for supervisor approval (with OTP)
        /// </summary>
        [HttpPost("SubmitForApproval")]
        public async Task<IActionResult> SubmitForApproval(
            [FromBody] ManualKeyInSubmitRequest request,
            CancellationToken ct)
        {
            try
            {
                if (request.ReconcileTranId <= 0)
                {
                    return ApiBadRequest("INVALID_TRAN_ID");
                }

                if (string.IsNullOrWhiteSpace(request.OtpCode))
                {
                    return ApiBadRequest("OTP_REQUIRED");
                }

                var data = await _manualKeyInService.SubmitForApprovalAsync(request, ct);

                if (!data.IsSuccess)
                {
                    return ApiBadRequest(data.Message);
                }

                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SubmitForApproval failed. TranId={TranId}", request.ReconcileTranId);
                return ApiInternalServerError("SUBMIT_FOR_APPROVAL_FAILED");
            }
        }
    }
}
